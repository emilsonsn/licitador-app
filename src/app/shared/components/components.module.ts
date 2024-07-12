import {forwardRef, NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {LoginLayoutComponent} from "@shared/components/login-layout/login-layout.component";
import {PrimaryInputComponent} from "@shared/components/primary-input/primary-input.component";
import {NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {LottieComponent} from "ngx-lottie";
import {LayoutPrivateComponent} from "@shared/components/layout-private/layout-private.component";

const components = [
  LoginLayoutComponent,
  PrimaryInputComponent,
  LayoutPrivateComponent
]

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    LottieComponent
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
