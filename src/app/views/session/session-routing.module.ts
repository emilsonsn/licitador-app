import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "@app/views/session/login/login.component";
import {ToRecoverComponent} from "@app/views/session/to-recover/to-recover.component";
import {RegisterComponent} from "@app/views/session/register/register.component";
import {sessionGuard} from "@app/guards/session.guard";
import {PasswordRecoveryComponent} from "@app/views/session/password-recovery/password-recovery.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [sessionGuard],
  },
  {
    path: "to-recover",
    component: ToRecoverComponent,
  },
  {
    path: "password_recovery",
    component: PasswordRecoveryComponent,
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionRoutingModule {
}
