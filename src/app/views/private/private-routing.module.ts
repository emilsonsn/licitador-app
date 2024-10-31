import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "@app/views/private/home/home.component";
import {LayoutPrivateComponent} from "@shared/layouts/layout-private/layout-private.component";
import {DashboardComponent} from "@app/views/private/dashboard/dashboard.component";
import {UsersComponent} from "@app/views/private/users/users.component";
import {HelpComponent} from "@app/views/private/help/help.component";
import {TendersComponent} from "@app/views/private/tenders/tenders.component";
import {TendersFavoritesComponent} from "@app/views/private/tenders-favorites/tenders-favorites.component";
import {adminGuard} from "@app/guards/admin.guard";
import {SettingsComponent} from "@app/views/private/settings/settings.component";
import { UserBusinessComponent } from './user-business/user-business.component';
import { AutomationComponent } from './automation/automation.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPrivateComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'automation',
        component: AutomationComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'user-business',
        component: UserBusinessComponent,
      },
      {
        path: 'help',
        component: HelpComponent
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'home/tenders',
        component: TendersComponent
      },
      {
        path: 'home/tenders/favorites',
        component: TendersFavoritesComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule {
}
