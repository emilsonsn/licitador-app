import {forwardRef, NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {LoginLayoutComponent} from "@shared/components/login-layout/login-layout.component";
import {PrimaryInputComponent} from "@shared/components/primary-input/primary-input.component";
import {FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {LottieComponent} from "ngx-lottie";
import {TenderCardComponent} from "@shared/components/tender-card/tender-card.component";
import {MatIcon} from "@angular/material/icon";

const components = [
  LoginLayoutComponent,
  PrimaryInputComponent,
  TenderCardComponent
]

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    LottieComponent,
    MatIcon,
    FormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrimaryInputComponent),
      multi: true
    }
  ],
  exports: components
})
export class ComponentsModule {
}
