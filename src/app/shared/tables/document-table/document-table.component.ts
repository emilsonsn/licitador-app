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
}
