import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "@app/views/private/home/home.component";
import {LayoutPrivateComponent} from "@shared/layouts/layout-private/layout-private.component";
import {DashboardComponent} from "@app/views/private/dashboard/dashboard.component";
import {UsersComponent} from "@app/views/private/users/users.component";
import {HelpComponent} from "@app/views/private/help/help.component";
import {TendersComponent} from "@app/views/private/tenders/tenders.component";

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
        component: DashboardComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'help',
        component: HelpComponent
      },
      {
        path: 'home/tenders',
        component: TendersComponent
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
