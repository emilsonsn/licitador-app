import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Order, PageControl} from "@model/application";
import {User} from "@model/User";
import {finalize} from "rxjs";
import {UserService} from "@services/User/user.service";
import { AutomationService } from '@services/automation/automation.service';

@Component({
  selector: 'app-automations-table',
  templateUrl: './automations-table.component.html',
  styleUrl: './automations-table.component.scss'
})
export class AutomationsTableComponent implements OnChanges{

  @Input()
  loading: boolean = false;

  @Input()
  searchTerm?: string = '';

  automations: any[] = [];

  columns = [
    {
      slug: 'id',
      order: true,
      title: 'ID',
      align: 'center'
    },
    {
      slug: 'state',
      order: true,
      title: 'ESTADO',
      align: 'center'
    },
    {
      slug: 'city',
      order: true,
      title: 'CIDADE',
      align: 'center'
    },
    {
      slug: 'status',
      order: true,
      title: 'STATUS',
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
    private readonly _automationServive: AutomationService
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

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  };

  public search(): void {
    this._initOrStopLoading();

    const filters = {}

    this._automationServive.search()
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe(res => {
        this.automations = res.data.data;
        console.log(this.automations);
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
