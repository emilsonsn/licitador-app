import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsersTableComponent} from "@shared/tables/users-table/users-table.component";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {MatPaginator} from "@angular/material/paginator";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import { AutomationsTableComponent } from './automations-table/automations-table.component';
import { PipesModule } from '@shared/pipes/pipes.module';



@NgModule({
  declarations: [
    UsersTableComponent,
    AutomationsTableComponent,
  ],
  exports: [
    UsersTableComponent,
    AutomationsTableComponent
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
