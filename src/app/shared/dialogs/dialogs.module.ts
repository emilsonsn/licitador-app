import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { MatIconModule } from '@angular/material/icon';
import { DialogCategoryComponent } from './category-user/dialog-category.component';
import { DialogDocumentComponent } from './dialog-document/dialog-document.component';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [
    DialogUserComponent,
    DialogCategoryComponent,
    DialogDocumentComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule
  ],
})
export class DialogsModule { }
