import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SessionRoutingModule} from './session-routing.module';
import {LoginComponent} from "@app/views/session/login/login.component";
import {SharedModule} from "@shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {ToRecoverComponent} from "@app/views/session/to-recover/to-recover.component";
import {RegisterComponent} from "@app/views/session/register/register.component";
import {AuthService} from "@services/Auth/auth.service";
import {LocalStorageService} from "@services/Help/local-storage.service";
import {PasswordRecoveryComponent} from "@app/views/session/password-recovery/password-recovery.component";


@NgModule({
  declarations: [
    LoginComponent,
    ToRecoverComponent,
    RegisterComponent,
    PasswordRecoveryComponent
  ],
  imports: [
    CommonModule,
    SessionRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    LocalStorageService
  ],
})
export class SessionModule {
}
