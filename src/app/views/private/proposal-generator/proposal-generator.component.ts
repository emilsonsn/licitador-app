import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {PageControl} from '@model/application';
import {Company} from '@model/company';
import {
  PROPOSAL_STATUS_OPTIONS,
  Proposal,
  ProposalFillResponse,
  ProposalItem,
  ProposalStatus,
  ProposalViewResponse
} from '@model/proposal';
import {ProposalService, ProposalFilters} from '@services/Proposal/proposal.service';
import {DialogConfirmComponent} from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-proposal-generator',
  templateUrl: './proposal-generator.component.html',
  styleUrls: ['./proposal-generator.component.scss']
})
export class ProposalGeneratorComponent implements OnInit {
  public proposalForm: FormGroup;
  public filterForm: FormGroup;
  public proposalStatuses = PROPOSAL_STATUS_OPTIONS;
  public proposals: Proposal[] = [];
  public viewData: ProposalViewResponse | null = null;
  public pageControl: PageControl = {page: 1, take: 8};
  public total = 0;
  public isLoadingList = false;
  public isFilling = false;
  public isSaving = false;
  public isLoadingView = false;
  public isDocumentMode = false;
  public currentProposalId: number | null = null;
  public warning: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly proposalService: ProposalService,
    private readonly toastr: ToastrService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      status: [''],
    });

    this.proposalForm = this.fb.group({
      tender_lookup_id: ['', Validators.required],
      company_id: [null],
      tender_id: [null, Validators.required],
      title: [''],
      organ_name: [''],
      organ_state: [''],
      purchase_number: [''],
      process_number: [''],
      receipt_date: [''],
      opening_date: [''],
      declarations: [''],
      city: [''],
      proposal_date: [''],
      responsible_name: [''],
      responsible_rg: [''],
      responsible_cpf: [''],
      status: ['draft' as ProposalStatus],
      items: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadProposals();
  }

  get items(): FormArray {
    return this.proposalForm.get('items') as FormArray;
  }

  public loadProposals(): void {
    this.isLoadingList = true;
    const filters = this.cleanFilters(this.filterForm.value);

    this.proposalService.search(this.pageControl, filters).subscribe({
      next: (response) => {
        const page = response?.data;
        this.proposals = page?.data ?? [];
        this.total = page?.total ?? this.proposals.length;
        this.pageControl.page = page?.current_page ?? this.pageControl.page;
      },
      error: () => this.toastr.error('Não foi possível carregar as propostas.'),
      complete: () => this.isLoadingList = false,
    });
  }

  public fillProposal(): void {
    if (!this.proposalForm.get('tender_lookup_id')?.value) {
      this.toastr.warning('Informe o ID da licitação.');
      return;
    }

    this.isFilling = true;
    this.warning = null;
    const tenderId = this.proposalForm.get('tender_lookup_id')?.value;

    this.proposalService.fill(tenderId).subscribe({
      next: (response) => {
        const data: ProposalFillResponse = response.data;
        this.currentProposalId = null;
        this.viewData = null;
        this.patchProposal(data.proposal, data.company?.id, data.tender?.id, data.items);
        this.proposalForm.patchValue({
          tender_lookup_id: data.tender?.id ?? tenderId,
          title: data.proposal?.title ?? this.defaultTitle(data.proposal),
          declarations: this.defaultDeclarations(data.company),
          city: data.proposal?.city || data.company?.city || '',
          responsible_name: data.proposal?.responsible_name || data.company?.legal_representative_name || '',
          responsible_rg: data.proposal?.responsible_rg || data.company?.legal_representative_rg || '',
          responsible_cpf: data.proposal?.responsible_cpf || data.company?.legal_representative_cpf || '',
        });
        this.warning = data.warning ?? null;
        this.toastr.success('Dados carregados para a proposta.');
      },
      error: (error) => {
        const message = error?.error?.error ?? 'Não foi possível preencher a proposta.';
        this.toastr.error(this.formatError(message));
      },
      complete: () => this.isFilling = false,
    });
  }

  public saveProposal(): void {
    if (this.proposalForm.invalid) {
      this.proposalForm.markAllAsTouched();
      this.toastr.warning('Revise os campos obrigatórios antes de salvar.');
      return;
    }

    this.isSaving = true;
    const payload = this.buildPayload();
    const request = this.currentProposalId
      ? this.proposalService.update(this.currentProposalId, payload)
      : this.proposalService.create(payload);

    request.subscribe({
      next: (response) => {
        const proposal: Proposal = response.data;
        this.currentProposalId = proposal.id ?? this.currentProposalId;
        this.patchProposal(proposal, proposal.company_id, proposal.tender_id, proposal.items ?? []);
        this.toastr.success(response?.message ?? 'Proposta salva com sucesso.');
        this.loadProposals();
        if (proposal.id) {
          this.openView(proposal);
        }
      },
      error: (error) => {
        const message = error?.error?.error ?? 'Não foi possível salvar a proposta.';
        this.toastr.error(this.formatError(message));
      },
      complete: () => this.isSaving = false,
    });
  }

  public editProposal(proposal: Proposal): void {
    if (!proposal.id) {
      return;
    }

    this.proposalService.get(proposal.id).subscribe({
      next: (response) => {
        const data: Proposal = response.data;
        this.currentProposalId = data.id ?? null;
        this.viewData = null;
        this.patchProposal(data, data.company_id, data.tender_id, data.items ?? []);
        this.proposalForm.patchValue({tender_lookup_id: data.tender_id});
      },
      error: () => this.toastr.error('Não foi possível abrir a proposta.'),
    });
  }

  public openView(proposal: Proposal): void {
    if (!proposal.id) {
      return;
    }

    this.isLoadingView = true;
    this.proposalService.view(proposal.id).subscribe({
      next: (response) => {
        this.viewData = response.data;
        this.currentProposalId = proposal.id ?? null;
        this.isDocumentMode = true;
      },
      error: () => this.toastr.error('Não foi possível carregar a visualização da proposta.'),
      complete: () => this.isLoadingView = false,
    });
  }

  public openTracking(proposal: Proposal, event?: Event): void {
    event?.stopPropagation();
    if (!proposal.id) {
      return;
    }

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/painel/proposal-generator', proposal.id, 'tracking'])
    );
    window.open(url, '_blank', 'noopener');
  }

  public openCatalog(proposal: Proposal, event?: Event): void {
    event?.stopPropagation();
    if (!proposal.id) {
      return;
    }
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/painel/proposal-generator', proposal.id, 'catalog'])
    );
    window.open(url, '_blank', 'noopener');
  }

  public deleteProposal(proposal: Proposal, event?: Event): void {
    event?.stopPropagation();
    if (!proposal.id) {
      return;
    }

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {text: 'Deseja remover esta proposta?'},
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed || !proposal.id) {
        return;
      }

      this.proposalService.delete(proposal.id).subscribe({
        next: () => {
          if (this.currentProposalId === proposal.id) {
            this.newProposal();
          }
          this.toastr.success('Proposta removida com sucesso.');
          this.loadProposals();
        },
        error: () => this.toastr.error('Não foi possível remover a proposta.'),
      });
    });
  }

  public newProposal(): void {
    this.currentProposalId = null;
    this.viewData = null;
    this.isDocumentMode = false;
    this.warning = null;
    this.proposalForm.reset({
      tender_lookup_id: '',
      status: 'draft',
    });
    this.items.clear();
  }

  public addItem(item?: ProposalItem): void {
    this.items.push(this.createItemGroup(item));
  }

  public removeItem(index: number): void {
    this.items.removeAt(index);
  }

  public printProposal(): void {
    const documentElement = document.getElementById('proposal-document');

    if (!documentElement) {
      this.toastr.warning('Abra a visualização da proposta antes de imprimir.');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=1024,height=768');

    if (!printWindow) {
      this.toastr.error('Não foi possível abrir a janela de impressão.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(this.printableHtml(documentElement.innerHTML));
    printWindow.document.close();
    printWindow.focus();

    printWindow.onload = () => {
      printWindow.print();
    };
  }

  public closeDocumentView(): void {
    this.isDocumentMode = false;
  }

  public backToForm(): void {
    this.isDocumentMode = false;

    if (this.currentProposalId) {
      this.editProposal({id: this.currentProposalId});
    }
  }

  public getLocalItemTotal(index: number): number {
    const item = this.items.at(index).value;
    return this.toNumber(item.quantity) * this.toNumber(item.unit_price);
  }

  public formatUnitPrice(index: number): void {
    const control = this.items.at(index).get('unit_price');

    control?.setValue(this.formatDecimal(control?.value), {emitEvent: false});
  }

  public getLocalTotal(): number {
    return this.items.controls.reduce((total, _control, index) => total + this.getLocalItemTotal(index), 0);
  }

  public getStatusLabel(status?: ProposalStatus | null): string {
    return this.proposalStatuses.find((option) => option.value === status)?.label ?? 'Rascunho';
  }

  public nextPage(): void {
    if (this.proposals.length < (this.pageControl.take ?? 8)) {
      return;
    }
    this.pageControl.page = (this.pageControl.page ?? 1) + 1;
    this.loadProposals();
  }

  public previousPage(): void {
    if ((this.pageControl.page ?? 1) <= 1) {
      return;
    }
    this.pageControl.page = (this.pageControl.page ?? 1) - 1;
    this.loadProposals();
  }

  private patchProposal(proposal: Proposal, companyId?: number | null, tenderId?: number | null, items: ProposalItem[] = []): void {
    this.proposalForm.patchValue({
      company_id: companyId ?? proposal.company_id ?? null,
      tender_id: tenderId ?? proposal.tender_id ?? null,
      title: proposal.title ?? this.defaultTitle(proposal),
      organ_name: proposal.organ_name ?? '',
      organ_state: proposal.organ_state ?? '',
      purchase_number: proposal.purchase_number ?? '',
      process_number: proposal.process_number ?? '',
      receipt_date: this.toDateInput(proposal.receipt_date),
      opening_date: this.toDateInput(proposal.opening_date),
      declarations: proposal.declarations ?? '',
      city: proposal.city ?? '',
      proposal_date: this.toDateInput(proposal.proposal_date),
      responsible_name: proposal.responsible_name ?? '',
      responsible_rg: proposal.responsible_rg ?? '',
      responsible_cpf: proposal.responsible_cpf ?? '',
      status: proposal.status ?? 'draft',
    });

    this.items.clear();
    if (items.length) {
      items.forEach((item) => this.addItem(item));
      return;
    }
    this.addItem();
  }

  private createItemGroup(item?: ProposalItem): FormGroup {
    return this.fb.group({
      item: [item?.item !== null && item?.item !== undefined ? String(item.item) : String(this.items.length + 1)],
      quantity: [item?.quantity ?? null],
      unit: [item?.unit ?? ''],
      specification: [item?.specification ?? ''],
      brand: [item?.brand ?? ''],
      unit_price: [this.formatDecimal(item?.unit_price)],
      source_payload: [item?.source_payload ?? null],
    });
  }

  private buildPayload(): Partial<Proposal> {
    const value = this.proposalForm.value;

    return {
      company_id: value.company_id,
      tender_id: value.tender_id,
      title: value.title,
      organ_name: value.organ_name,
      organ_state: value.organ_state,
      purchase_number: value.purchase_number,
      process_number: value.process_number,
      receipt_date: value.receipt_date || null,
      opening_date: value.opening_date || null,
      declarations: value.declarations,
      city: value.city,
      proposal_date: value.proposal_date || null,
      responsible_name: value.responsible_name,
      responsible_rg: value.responsible_rg,
      responsible_cpf: value.responsible_cpf,
      status: value.status,
      items: (value.items ?? []).map((item: ProposalItem) => ({
        item: item.item !== null && item.item !== undefined ? String(item.item) : null,
        quantity: this.emptyToNull(item.quantity),
        unit: item.unit,
        specification: item.specification,
        brand: item.brand,
        unit_price: this.numberOrNull(item.unit_price),
        source_payload: item.source_payload,
      })),
    };
  }

  private cleanFilters(filters: ProposalFilters): ProposalFilters {
    return Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        (acc as any)[key] = value;
      }
      return acc;
    }, {} as ProposalFilters);
  }

  private defaultTitle(proposal: Proposal): string {
    return `Proposta ${proposal.purchase_number ?? proposal.process_number ?? ''}`.trim();
  }

  private defaultDeclarations(company?: Company | null): string {
    return [
      'VALIDADE DA PROPOSTA: DE ACORDO COM EDITAL',
      '',
      'DECLARAÇÃO:',
      '',
      'A- Declaro ter tomado conhecimento do instrumento convocatório relativo à licitação em referência, estar ciente dos critérios de julgamento do certame e da mediação e pagamentos estabelecidos para remunerar a execução do objeto licitado.',
      '',
      'B- Declaro também estar de acordo com todas as exigências, condições e solicitações contidas no edital e anexos de convocação.',
      '',
      'C- Declaramos expressamente que, no preço acima ofertado, estão inclusos todos os custos indiretos tais como: impostos, taxas, fretes, seguros, embalagem, etc.',
      '',
      'D- Declaro ter tomado conhecimento do instrumento convocatório relativo à licitação em referência, estar ciente dos critérios de julgamento do certame e da forma de mediação e pagamento estabelecidos para remunerar a execução do objeto licitado.',
      '',
      'E- VALIDADE DA PROPOSTA E FORMA DE PAGAMENTO CONFORME EDITAL',
      '',
      '----------------------------------------------------------------------------------------------------------',
      '',
      'Pagamento deverá ser realizado através de depósito bancário:',
      `Banco: ${company?.bank ?? ''}`,
      `Agência: ${company?.agency ?? ''}`,
      `Conta Corrente: ${company?.checking_account ?? ''}`,
    ].join('\n');
  }

  private printableHtml(documentHtml: string): string {
    return `
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <title>Proposta Comercial</title>
          <style>
            @page {
              size: A4;
              margin: 14mm;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              color: #111;
              background: #fff;
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.35;
            }

            .proposal-document {
              width: 100%;
              margin: 0;
              border: 0;
              padding: 0;
              color: #111;
              background: #fff;
              font-family: Arial, sans-serif;
            }

            .proposal-document header {
              margin-bottom: 34px;
              text-align: right;
            }

            .proposal-document header h1 {
              margin: 0 0 12px;
              font-size: 16px;
              text-transform: uppercase;
            }

            .proposal-document h2 {
              margin: 0 0 18px;
              font-size: 16px;
            }

            .proposal-document p {
              margin: 3px 0;
            }

            .document-meta {
              margin-bottom: 18px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 14px;
              font-size: 11px;
            }

            th,
            td {
              border: 1px solid #d7dbe2;
              padding: 8px;
              text-align: left;
              vertical-align: top;
            }

            th {
              background: #f2f4f7;
              font-weight: 700;
            }

            .document-total {
              text-align: right;
            }

            pre {
              margin-top: 24px;
              white-space: pre-wrap;
              font-family: Arial, sans-serif;
              line-height: 1.5;
            }

            footer {
              margin-top: 48px;
              text-align: center;
            }

            .signature-line {
              width: 320px;
              max-width: 80%;
              height: 1px;
              margin: 42px auto 10px;
              background: #111;
            }

            footer span {
              display: block;
              margin-top: 4px;
            }
          </style>
        </head>
        <body>
          <article class="proposal-document">${documentHtml}</article>
        </body>
      </html>
    `;
  }

  private toDateInput(value?: string | null): string {
    if (!value) {
      return '';
    }
    return String(value).slice(0, 10);
  }

  private toNumber(value: unknown): number {
    let normalized: unknown = value;

    if (typeof value === 'string') {
      let text = value.trim().replace(/\s/g, '');

      if (text.includes(',')) {
        text = text.replace(/\./g, '').replace(',', '.');
      } else if ((text.match(/\./g) ?? []).length > 1) {
        text = text.replace(/\./g, '');
      }

      normalized = text;
    }

    const number = Number(normalized);
    return Number.isFinite(number) ? number : 0;
  }

  private formatDecimal(value: unknown): string | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const number = this.toNumber(value);

    if (!number) {
      return '0,00';
    }

    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(number);
  }

  private numberOrNull(value: unknown): number | null {
    if (value === '' || value === undefined || value === null) {
      return null;
    }

    return this.toNumber(value);
  }

  private emptyToNull(value: unknown): number | string | null {
    return value === '' || value === undefined ? null : value as any;
  }

  private formatError(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object') {
      return Object.values(error).flat().join(' ');
    }

    return 'Erro inesperado.';
  }
}
