import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Order, PageControl} from "@model/application";
import {User} from "@model/User";
import {finalize} from "rxjs";
import {UserService} from "@services/User/user.service";

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss'
})
export class UsersTableComponent implements OnChanges{

  @Input()
  loading: boolean = false;

  @Input()
  searchTerm?: string = '';

  users: User[] = [];

  columns = [
    {
      slug: 'id',
      order: true,
      title: 'ID',
      align: 'center'
    },
    {
      slug: 'name',
      order: true,
      title: 'NOME',
      align: 'center'
    },
    {
      slug: 'email',
      order: true,
      title: 'EMAIL',
      align: 'center'
    },
    {
      slug: 'is_active',
      order: true,
      title: 'ATIVO',
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
    private readonly _userService: UserService
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

  public blockUser(id?: number): void {
    if (id) {
      this._userService.blockUser(id)
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

    this._userService.getUsers(this.pageControl, filters)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe(res => {
        this.users = res.data.data;
        this.pageControl.search_term = this.searchTerm || '';
        this.pageControl.page = res.current_page;
        this.pageControl.itemCount = res.total;
        this.pageControl.pageCount = res.last_page;
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
