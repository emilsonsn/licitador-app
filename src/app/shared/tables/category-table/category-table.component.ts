import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Order, PageControl} from "@model/application";
import {User} from "@model/User";
import {finalize} from "rxjs";
import {UserService} from "@services/User/user.service";
import { Category } from '@model/category';
import { CategoryService } from '@services/Category/category.service';

@Component({
  selector: 'app-category-table',
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.scss'
})
export class CategoryTableComponent implements OnChanges{

  @Input()
  loading: boolean = false;

  @Input()
  searchTerm?: string = '';

  categories: Category[] = [];

  columns = [
    {
      slug: 'id',
      order: true,
      title: 'ID',
      align: 'center'
    },
    {
      slug: 'description',
      order: true,
      title: 'DESCRIÇÃO',
      align: 'center'
    },
    {
      slug: 'created_at',
      order: true,
      title: 'DATA DE CRIAÇÃO',
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
    private readonly _categoryService: CategoryService
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

  private _onSearch() {
    this.pageControl.search_term = this.searchTerm || '';
    this.pageControl.page = 1;
    this.search();
  }

  public deleteCategory(id?: number): void {
    if (id) {
      this._categoryService.delete(id)
        .subscribe({
          next: () => {
            this.search();
          }
        });
    }
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  };

  public search(): void {
    this._initOrStopLoading();

    const filters = {}

    this._categoryService.search(this.pageControl, filters)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe(res => {
        this.categories = res.data.data;
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
