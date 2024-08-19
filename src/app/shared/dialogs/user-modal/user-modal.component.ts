import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [
    MatLabel,
    MatSlideToggle,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatDialogTitle,
    MatDialogContent,
    MatButton,
    MatDialogClose,
    MatDialogActions,
    NgClass
  ],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss'
})
export class UserModalComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      is_active: [data?.is_active || false]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
