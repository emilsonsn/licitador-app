import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsersTableComponent} from "@shared/tables/users-table/users-table.component";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {MatPaginator} from "@angular/material/paginator";



@NgModule({
  declarations: [
    UsersTableComponent
  ],
  exports: [
    UsersTableComponent
  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    MatPaginator,
  ]
})
export class TablesModule { }
