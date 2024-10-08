import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LayoutPrivateComponent} from "@shared/layouts/layout-private/layout-private.component";
import {RouterOutlet} from "@angular/router";
import {SidebarPrivateComponent} from "@shared/layouts/sidebar-private/sidebar-private.component";
import {HeaderPrivateComponent} from "@shared/layouts/header-private/header-private.component";
import {LottieComponent} from "ngx-lottie";

const components = [
  LayoutPrivateComponent,
  SidebarPrivateComponent,
  HeaderPrivateComponent
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    RouterOutlet,
    LottieComponent
  ],
  exports: components
})
export class LayoutsModule { }
