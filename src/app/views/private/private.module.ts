import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import {SharedModule} from "@shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {HomeComponent} from "@app/views/private/home/home.component";
import {HelpComponent} from "@app/views/private/help/help.component";
import {DashboardComponent} from "@app/views/private/dashboard/dashboard.component";
import {UsersComponent} from "@app/views/private/users/users.component";
import {TendersComponent} from "@app/views/private/tenders/tenders.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";


@NgModule({
  declarations: [
    HomeComponent,
    UsersComponent,
    DashboardComponent,
    HelpComponent,
    TendersComponent
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormField,
    MatIconButton,
    MatInput,
    MatLabel
  ]
})
export class PrivateModule { }
