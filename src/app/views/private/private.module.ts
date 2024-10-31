import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PrivateRoutingModule} from './private-routing.module';
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
import {QrCodeModule} from "ng-qrcode";
import {MatDivider} from "@angular/material/divider";
import {TendersFavoritesComponent} from "@app/views/private/tenders-favorites/tenders-favorites.component";
import {SettingsComponent} from "@app/views/private/settings/settings.component";
import {MatPaginator, MatPaginatorIntl} from "@angular/material/paginator";
import {getPortuguesePaginatorIntl} from "@shared/hepers/PortuguesePaginator";
import { UserBusinessComponent } from './user-business/user-business.component';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localePtExtra from '@angular/common/locales/extra/pt';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogsModule } from '@shared/dialogs/dialogs.module';
import { AutomationComponent } from './automation/automation.component';

registerLocaleData(localePt, 'pt-BR', localePtExtra);

@NgModule({
  declarations: [
    HomeComponent,
    UsersComponent,
    DashboardComponent,
    AutomationComponent,
    HelpComponent,
    TendersComponent,
    TendersFavoritesComponent,
    SettingsComponent,
    UserBusinessComponent,
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormField,
    MatIconButton,
    MatDialogModule,
    DialogsModule,
    MatInput,
    MatLabel,
    QrCodeModule,
    MatDivider,
    MatPaginator,
  ],
  providers: [MatPaginatorIntl, {provide: MatPaginatorIntl, useValue: getPortuguesePaginatorIntl()}],
})
export class PrivateModule {
}
