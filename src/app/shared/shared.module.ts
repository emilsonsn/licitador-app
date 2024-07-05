import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TablesModule} from "@shared/tables/tables.module";
import {PipesModule} from "@shared/pipes/pipes.module";
import {LayoutsModule} from "@shared/layouts/layouts.module";
import {DirectivesModule} from "@shared/directives/directives.module";
import {ComponentsModule} from "@shared/components/components.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    TablesModule,
    PipesModule,
    LayoutsModule,
    DirectivesModule,
    ComponentsModule
  ]
})
export class SharedModule {
}
