import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsersTableComponent} from "@shared/tables/users-table/users-table.component";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {MatPaginator} from "@angular/material/paginator";
import {MatSlideToggle} from "@angular/material/slide-toggle";



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
    MatSlideToggle,
  ]
})
export class TablesModule { }
