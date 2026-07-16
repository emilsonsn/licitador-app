import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {
  ProposalTrackingItem,
  ProposalTrackingItemResult,
  ProposalTrackingRanking,
  ProposalTrackingResponse
} from '@model/proposal';
import {ProposalService} from '@services/Proposal/proposal.service';
import {DialogConfirmComponent} from '@shared/dialogs/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-proposal-tracking',
  templateUrl: './proposal-tracking.component.html',
  styleUrls: ['./proposal-tracking.component.scss']
})
export class ProposalTrackingComponent implements OnInit {
  public proposalId = 0;
  public data: ProposalTrackingResponse | null = null;
  public discountPercentage = '';
  public isLoading = true;
  public isSaving = false;
  public isApplyingDiscount = false;
  public isChangingStatus = false;
  public isExporting = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly proposalService: ProposalService,
    private readonly toastr: ToastrService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.proposalId = Number(this.route.snapshot.paramMap.get('proposalId'));
    if (!this.proposalId) {
      this.toastr.error('Proposta inválida.');
      this.close();
      return;
    }
    this.load();
  }

  get isFinished(): boolean {
    return this.data?.tracking.status === 'finished';
  }

  get wonItems(): ProposalTrackingItem[] {
    return this.data?.items.filter((item) => item.result === 'won') ?? [];
  }

  load(): void {
    this.isLoading = true;
    this.proposalService.tracking(this.proposalId).subscribe({
      next: (response) => this.setData(response.data),
      error: (error) => this.toastr.error(this.errorMessage(error, 'Não foi possível carregar o acompanhamento.')),
      complete: () => this.isLoading = false
    });
  }

  setResult(item: ProposalTrackingItem, result: ProposalTrackingItemResult): void {
    if (this.isFinished) {
      return;
    }
    if (item.result === result) {
      item.result = 'pending';
      item.rankings = [];
      return;
    }

    item.result = result;
    item.rankings ??= [];
    this.ensureRankingRows(item);

    if (result === 'won') {
      const firstPlace = this.rankingFor(item, 1);
      firstPlace.company ||= this.data?.company.corporate_reason
        || this.data?.company.fantasy_name
        || '';
      firstPlace.brand ||= item.brand ?? null;
      firstPlace.price ||= item.minimum_unit_price || item.unit_price || '';
    }
  }

  rankingFor(item: ProposalTrackingItem, position: 1 | 2 | 3): ProposalTrackingRanking {
    item.rankings ??= [];
    let ranking = item.rankings.find((entry) => entry.position === position);
    if (!ranking) {
      ranking = {position, company: '', brand: null, price: ''};
      item.rankings.push(ranking);
      item.rankings.sort((left, right) => left.position - right.position);
    }
    return ranking;
  }

  save(): void {
    if (!this.data || this.isFinished || this.isSaving) {
      return;
    }

    const invalidItem = this.data.items.find((item) =>
      item.result !== 'pending' && !this.validRankings(item).length
      || this.hasIncompleteRanking(item)
    );
    if (invalidItem) {
      this.toastr.warning(`Revise a classificação do item ${invalidItem.item || invalidItem.proposal_item_id}. Empresa e preço são obrigatórios.`);
      return;
    }

    this.isSaving = true;
    this.proposalService.updateTracking(this.proposalId, {
      discount_percentage: this.emptyToNull(this.discountPercentage),
      items: this.data.items.map((item) => ({
        proposal_item_id: item.proposal_item_id,
        result: item.result,
        minimum_unit_price: this.emptyToNull(item.minimum_unit_price),
        ...(item.result === 'pending' ? {} : {rankings: this.validRankings(item)})
      }))
    }).subscribe({
      next: (response) => {
        this.setData(response.data);
        this.toastr.success(response.message ?? 'Acompanhamento salvo com sucesso.');
      },
      error: (error) => this.toastr.error(this.errorMessage(error, 'Não foi possível salvar o acompanhamento.')),
      complete: () => this.isSaving = false
    });
  }

  applyDiscount(): void {
    const percentage = Number(String(this.discountPercentage).replace(',', '.'));
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
      this.toastr.warning('Informe um desconto entre 0 e 100%.');
      return;
    }

    this.isApplyingDiscount = true;
    this.proposalService.applyTrackingDiscount(this.proposalId, percentage.toFixed(4)).subscribe({
      next: (response) => {
        this.setData(response.data);
        this.toastr.success(response.message ?? 'Desconto aplicado com sucesso.');
      },
      error: (error) => this.toastr.error(this.errorMessage(error, 'Não foi possível aplicar o desconto.')),
      complete: () => this.isApplyingDiscount = false
    });
  }

  changeStatus(): void {
    const finishing = !this.isFinished;
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '390px',
      data: {text: finishing
        ? 'Deseja finalizar o acompanhamento? Ele ficará somente leitura até ser reaberto.'
        : 'Deseja reabrir este acompanhamento para edição?'}
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }
      this.isChangingStatus = true;
      const request = finishing
        ? this.proposalService.finishTracking(this.proposalId)
        : this.proposalService.reopenTracking(this.proposalId);
      request.subscribe({
        next: (response) => {
          this.setData(response.data);
          this.toastr.success(response.message);
        },
        error: (error) => this.toastr.error(this.errorMessage(error, 'Não foi possível alterar o acompanhamento.')),
        complete: () => this.isChangingStatus = false
      });
    });
  }

  print(): void {
    this.proposalService.printTracking(this.proposalId).subscribe({
      next: (response) => {
        this.setData(response.data);
        setTimeout(() => window.print());
      },
      error: (error) => this.toastr.error(this.errorMessage(error, 'Não foi possível preparar a impressão.'))
    });
  }

  export(): void {
    this.isExporting = true;
    this.proposalService.exportTracking(this.proposalId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `acompanhamento-proposta-${this.proposalId}.csv`;
        anchor.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toastr.error('Não foi possível exportar o acompanhamento.'),
      complete: () => this.isExporting = false
    });
  }

  close(): void {
    if (window.opener) {
      window.close();
      return;
    }
    this.router.navigate(['/painel/proposal-generator']);
  }

  minimumTotal(item: ProposalTrackingItem): number {
    return this.toNumber(item.quantity) * this.toNumber(item.minimum_unit_price);
  }

  minimumGrandTotal(): number {
    return this.data?.items.reduce((total, item) => total + this.minimumTotal(item), 0) ?? 0;
  }

  wonGrandTotal(): number {
    return this.wonItems.reduce((total, item) => total + this.minimumTotal(item), 0);
  }

  trackByItem(_: number, item: ProposalTrackingItem): number {
    return item.proposal_item_id;
  }

  private validRankings(item: ProposalTrackingItem): ProposalTrackingRanking[] {
    return (item.rankings ?? [])
      .filter((ranking) => !!ranking.company?.trim() && ranking.price !== null && ranking.price !== undefined && ranking.price !== '')
      .map((ranking) => ({
        position: ranking.position,
        company: ranking.company.trim(),
        brand: ranking.brand?.trim() || null,
        price: String(ranking.price).replace(',', '.')
      }));
  }

  private hasIncompleteRanking(item: ProposalTrackingItem): boolean {
    if (item.result === 'pending') {
      return false;
    }
    return (item.rankings ?? []).some((ranking) => {
      const touched = !!ranking.company?.trim() || !!ranking.brand?.trim() || ranking.price !== '';
      return touched && (!ranking.company?.trim() || ranking.price === null || ranking.price === undefined || ranking.price === '');
    });
  }

  private setData(data: ProposalTrackingResponse): void {
    data.items.forEach((item) => {
      item.rankings ??= [];
      if (item.result !== 'pending') {
        this.ensureRankingRows(item);
      }
    });
    this.data = data;
    this.discountPercentage = data.tracking.discount_percentage ?? '';
  }

  private ensureRankingRows(item: ProposalTrackingItem): void {
    ([1, 2, 3] as const).forEach((position) => this.rankingFor(item, position));
  }

  private emptyToNull(value: unknown): string | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    return String(value).replace(',', '.');
  }

  private toNumber(value: unknown): number {
    const number = Number(String(value ?? 0).replace(',', '.'));
    return Number.isFinite(number) ? number : 0;
  }

  private errorMessage(error: any, fallback: string): string {
    const message = error?.error?.error;
    if (typeof message === 'string') {
      return message;
    }
    if (message && typeof message === 'object') {
      return Object.values(message).flat().join(' ');
    }
    return fallback;
  }
}
