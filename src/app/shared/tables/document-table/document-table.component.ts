import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Order, PageControl} from "@model/application";
import {User} from "@model/User";
import {finalize} from "rxjs";
import {UserService} from "@services/User/user.service";
import { Category } from '@model/category';
import { CategoryService } from '@services/Category/category.service';
import { Document } from '@model/document';
import { DocumentService } from '@services/Document/document.service';
import { DialogDocumentComponent } from '@shared/dialogs/dialog-document/dialog-document.component';
import { MatDialog } from '@angular/material/dialog';
import JSZip from 'jszip';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-document-table',
  templateUrl: './document-table.component.html',
  styleUrl: './document-table.component.scss'
})
export class DocumentTableComponent implements OnChanges{

  @Input()
  loading: boolean = false;

  @Input()
  searchTerm?: string = '';

  documents: Document[] = [];
  selectedDocumentIds: Set<number> = new Set();
  isDownloadingZip = false;

  columns = [
    {
      slug: 'id',
      order: true,
      title: 'ID',
      align: 'center'
    },
    {
      slug: 'category',
      order: true,
      title: 'CATEGORIA',
      align: 'center'
    },
    {
      slug: 'description',
      order: true,
      title: 'DESCRIÇÃO',
      align: 'center'
    },
    {
      slug: 'filename',
      order: true,
      title: 'NOME DO ARQUIVO',
      align: 'center'
    },
    {
      slug: 'expiration_date',
      order: true,
      title: 'DATA DE EXPIRAÇÃO',
      align: 'center'
    },
    {
      slug: 'actions',
      order: true,
      title: 'AÇÕES',
      align: 'center'
    },
  ]

  pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: 'name',
    order: Order.ASC,
  };

  constructor(
    private readonly _documentService: DocumentService,
    private dialog: MatDialog,
    private readonly _toastrService: ToastrService,
  ) {
    this.search();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {searchTerm, loading, type} = changes;

    if (searchTerm?.previousValue && searchTerm?.currentValue !== searchTerm?.previousValue) {
      this._onSearch();
    } else if (type?.previousValue && type?.currentValue !== type?.previousValue) {
      this._onSearch();
    } else if (!loading?.currentValue) {
      this._onSearch();
    }
  }

  isDateExpired(expirationDate: Date): boolean {
    const today = new Date();
    const expDate = new Date(expirationDate);
    return expDate < today;
  }  

  public onEditButton(document: Document){
    this.dialog.open(DialogDocumentComponent, {
      data: document,
      width: '400px',
    })
    .afterClosed()
    .subscribe(result => {
      this.search();
    });
  }

  private _onSearch() {
    this.pageControl.search_term = this.searchTerm || '';
    this.pageControl.page = 1;
    setTimeout(() => {
      this.search();
    }, 100);
  }

  public deleteCategory(id?: number): void {
    if (id) {
      this._documentService.delete(id)
        .subscribe({
          next: () => {
            this.search();
          }
        });
    }
  }

  openDocument(path: string): void {
    window.open(path, '_blank');
  }  

  public toggleDocumentSelection(document: Document, checked: boolean): void {
    if (!document.id || !document.path) {
      return;
    }

    if (checked) {
      this.selectedDocumentIds.add(document.id);
      return;
    }

    this.selectedDocumentIds.delete(document.id);
  }

  public toggleAllVisible(checked: boolean): void {
    this.documents
      .filter((document) => !!document.id && !!document.path)
      .forEach((document) => {
        if (checked) {
          this.selectedDocumentIds.add(document.id as number);
          return;
        }

        this.selectedDocumentIds.delete(document.id as number);
      });
  }

  public isSelected(document: Document): boolean {
    return !!document.id && this.selectedDocumentIds.has(document.id);
  }

  public areAllVisibleSelected(): boolean {
    const downloadableDocuments = this.documents.filter((document) => !!document.id && !!document.path);

    return !!downloadableDocuments.length
      && downloadableDocuments.every((document) => this.selectedDocumentIds.has(document.id as number));
  }

  public get selectedDocuments(): Document[] {
    return this.documents.filter((document) => !!document.id && this.selectedDocumentIds.has(document.id));
  }

  public async downloadSelectedDocuments(): Promise<void> {
    const documents = this.selectedDocuments;

    if (!documents.length) {
      this._toastrService.warning('Selecione ao menos um documento.');
      return;
    }

    this.isDownloadingZip = true;

    try {
      const zip = new JSZip();

      for (const [index, document] of documents.entries()) {
        if (!document.path) {
          continue;
        }

        const response = await fetch(document.path, {credentials: 'include'});

        if (!response.ok) {
          throw new Error(`Não foi possível baixar o documento ${document.filename || document.id}.`);
        }

        const blob = await response.blob();
        zip.file(this.uniqueFilename(document, index), blob);
      }

      const zipBlob = await zip.generateAsync({type: 'blob'});
      const url = URL.createObjectURL(zipBlob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `documentos-${new Date().toISOString().slice(0, 10)}.zip`;
      link.click();
      URL.revokeObjectURL(url);
      this._toastrService.success('Documentos compactados com sucesso.');
    } catch (error: any) {
      this._toastrService.error(error?.message ?? 'Não foi possível gerar o arquivo zip.');
    } finally {
      this.isDownloadingZip = false;
    }
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  };

  public search(): void {
    this._initOrStopLoading();

    const filters = {}

    this._documentService.search(this.pageControl, filters)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe(res => {
        this.documents = res.data.data;
        this.selectedDocumentIds.clear();
        this.pageControl.search_term = this.searchTerm || '';

        this.pageControl.page = res.data.current_page - 1;
        this.pageControl.itemCount = res.data.total;
        this.pageControl.pageCount = res.data.last_page;
      });
  }

  public onClickOrderBy(slug: string, order: boolean) {
    if (!order) {
      return;
    }

    if (this.pageControl.orderField === slug) {
      this.pageControl.order = this.pageControl.order === Order.ASC ? Order.DESC : Order.ASC;
    } else {
      this.pageControl.order = Order.ASC;
      this.pageControl.orderField = slug;
    }
    this.pageControl.page = 1;
    this.search();
  }

  pageEvent($event: any) {
    this.pageControl.page = $event.pageIndex + 1;
    this.pageControl.take = $event.pageSize;
    this.search();
  }

  private uniqueFilename(document: Document, index: number): string {
    const fallbackName = `documento-${document.id ?? index + 1}`;
    const filename = (document.filename || fallbackName).trim();
    const sanitized = filename.replace(/[\\/:*?"<>|]/g, '-');

    return `${String(index + 1).padStart(2, '0')}-${sanitized}`;
  }
}
