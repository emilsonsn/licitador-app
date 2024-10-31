import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutomationStatusPipe } from './automation-status.pipe';



@NgModule({
  declarations: [	
      AutomationStatusPipe
   ],
   exports:[
    AutomationStatusPipe
   ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
