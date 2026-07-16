import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {ProposalCatalog, ProposalCatalogItem} from '@model/proposal';
import {ProposalService} from '@services/Proposal/proposal.service';

@Component({
  selector: 'app-proposal-catalog',
  templateUrl: './proposal-catalog.component.html',
  styleUrls: ['./proposal-catalog.component.scss']
})
export class ProposalCatalogComponent implements OnInit, OnDestroy {
  public proposalId = 0;
  public catalog: ProposalCatalog | null = null;
  public isLoading = true;
  public isSaving = false;
  public isGenerating = false;
  public imageBusyItemId: number | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly proposalService: ProposalService,
    private readonly toastr: ToastrService
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

  ngOnDestroy(): void {
    this.revokePreviews(this.catalog?.items ?? []);
  }

  async load(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await firstValueFrom(this.proposalService.catalog(this.proposalId));
      this.setCatalog(response.data);
    } catch (error) {
      this.toastr.error(this.errorMessage(error, 'Não foi possível carregar o catálogo.'));
    } finally {
      this.isLoading = false;
    }
  }

  addItem(): void {
    if (!this.catalog) return;
    this.catalog.items.push({position: this.catalog.items.length + 1, title: '', specification: '', quantity: null, unit: '', brand: ''});
  }

  moveItem(index: number, direction: -1 | 1): void {
    if (!this.catalog) return;
    const target = index + direction;
    if (target < 0 || target >= this.catalog.items.length || this.catalog.items[index].removed) return;
    [this.catalog.items[index], this.catalog.items[target]] = [this.catalog.items[target], this.catalog.items[index]];
    this.normalizePositions();
  }

  toggleRemoval(item: ProposalCatalogItem): void {
    item.removed = !item.removed;
  }

  selectImage(item: ProposalCatalogItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.toastr.warning('Selecione uma imagem JPG, JPEG, PNG ou WEBP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.toastr.warning('A imagem deve possuir no máximo 5 MB.');
      return;
    }
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    item.pendingImage = file;
    item.previewUrl = URL.createObjectURL(file);
  }

  async removeImage(item: ProposalCatalogItem): Promise<void> {
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    item.previewUrl = null;
    item.pendingImage = null;
    if (!item.id || !item.image_url) return;
    this.imageBusyItemId = item.id;
    try {
      const response = await firstValueFrom(this.proposalService.deleteCatalogImage(this.proposalId, item.id));
      Object.assign(item, response.data);
      this.toastr.success('Imagem removida com sucesso.');
    } catch (error) {
      this.toastr.error(this.errorMessage(error, 'Não foi possível remover a imagem.'));
    } finally {
      this.imageBusyItemId = null;
    }
  }

  async save(): Promise<void> {
    await this.persist(true);
  }

  async generate(): Promise<void> {
    if (this.isGenerating) return;
    this.isGenerating = true;
    try {
      const saved = await this.persist(false);
      if (!saved) return;
      const response = await firstValueFrom(this.proposalService.generateCatalog(this.proposalId));
      this.setCatalog(response.data);
      const url = this.router.serializeUrl(this.router.createUrlTree(['/painel/proposal-catalog', response.data.id, 'view']));
      window.open(url, '_blank', 'noopener');
    } catch (error) {
      this.toastr.error(this.errorMessage(error, 'Não foi possível gerar o catálogo.'));
    } finally {
      this.isGenerating = false;
    }
  }

  close(): void {
    if (window.opener) {
      window.close();
      return;
    }
    this.router.navigate(['/painel/proposal-generator']);
  }

  imageSource(item: ProposalCatalogItem): string | null {
    return item.previewUrl || item.image_url || null;
  }

  trackByItem(index: number, item: ProposalCatalogItem): number | string {
    return item.id ?? `new-${index}`;
  }

  private async persist(showSuccess: boolean): Promise<ProposalCatalog | null> {
    if (!this.catalog || this.isSaving) return null;
    if (!this.catalog.title?.trim()) {
      this.toastr.warning('Informe o título do catálogo.');
      return null;
    }
    this.isSaving = true;
    const activeItems = this.catalog.items.filter((item) => !item.removed);
    const pendingUploads = activeItems
      .map((item, index) => ({position: index + 1, file: item.pendingImage}))
      .filter((entry): entry is {position: number; file: File} => !!entry.file);

    try {
      const response = await firstValueFrom(this.proposalService.updateCatalog(this.proposalId, {
        title: this.catalog.title.trim(),
        subtitle: this.catalog.subtitle || null,
        general_notes: this.catalog.general_notes || null,
        organ_name: this.catalog.organ_name || null,
        organ_state: this.catalog.organ_state || null,
        purchase_number: this.catalog.purchase_number || null,
        process_number: this.catalog.process_number || null,
        receipt_date: this.dateValue(this.catalog.receipt_date),
        opening_date: this.dateValue(this.catalog.opening_date),
        items: activeItems.map((item, index) => ({
          ...(item.id ? {id: item.id} : {}),
          ...(item.proposal_item_id ? {proposal_item_id: item.proposal_item_id} : {}),
          title: item.title || null,
          specification: item.specification || null,
          quantity: item.quantity === '' ? null : item.quantity,
          unit: item.unit || null,
          brand: item.brand || null,
          position: index + 1
        }))
      }));
      let saved: ProposalCatalog = response.data;
      for (const upload of pendingUploads) {
        const savedItem = saved.items.find((item) => item.position === upload.position);
        if (!savedItem?.id) continue;
        await firstValueFrom(this.proposalService.uploadCatalogImage(this.proposalId, savedItem.id, upload.file));
      }
      if (pendingUploads.length) {
        saved = (await firstValueFrom(this.proposalService.catalog(this.proposalId))).data;
      }
      this.setCatalog(saved);
      if (showSuccess) this.toastr.success(response.message ?? 'Catálogo salvo com sucesso.');
      return saved;
    } catch (error) {
      this.toastr.error(this.errorMessage(error, 'Não foi possível salvar o catálogo.'));
      return null;
    } finally {
      this.isSaving = false;
    }
  }

  private setCatalog(catalog: ProposalCatalog): void {
    this.revokePreviews(this.catalog?.items ?? []);
    catalog.receipt_date = this.dateValue(catalog.receipt_date);
    catalog.opening_date = this.dateValue(catalog.opening_date);
    catalog.items = [...(catalog.items ?? [])].sort((a, b) => a.position - b.position);
    this.catalog = catalog;
  }

  private normalizePositions(): void {
    this.catalog?.items.forEach((item, index) => item.position = index + 1);
  }

  private dateValue(value?: string | null): string | null {
    return value ? value.slice(0, 10) : null;
  }

  private revokePreviews(items: ProposalCatalogItem[]): void {
    items.forEach((item) => item.previewUrl && URL.revokeObjectURL(item.previewUrl));
  }

  private errorMessage(error: any, fallback: string): string {
    const message = error?.error?.error;
    if (typeof message === 'string') return message;
    if (message && typeof message === 'object') return Object.values(message).flat().join(' ');
    return fallback;
  }
}
