import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsersTableComponent} from "@shared/tables/users-table/users-table.component";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {MatPaginator} from "@angular/material/paginator";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import { AutomationsTableComponent } from './automations-table/automations-table.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { CategoryTableComponent } from './category-table/category-table.component';
import { DocumentTableComponent } from './document-table/document-table.component';



@NgModule({
  declarations: [
    UsersTableComponent,
    AutomationsTableComponent,
    CategoryTableComponent,
    DocumentTableComponent
  ],
  exports: [
    UsersTableComponent,
    AutomationsTableComponent,
    CategoryTableComponent,
    DocumentTableComponent
  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    MatPaginator,
    MatSlideToggle,
    PipesModule
  ]
})
export class TablesModule { }
