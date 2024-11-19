import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '@services/Category/category.service';
import { UserService } from '@services/User/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-category',
  templateUrl: './dialog-category.component.html',
  styleUrls: ['./dialog-category.component.scss']
})
export class DialogCategoryComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogCategoryComponent>,
    private _categoryService: CategoryService,
    private _toastrService: ToastrService
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required],      
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this._categoryService.create(this.form.getRawValue())
      .subscribe({
        next: (res) =>{
          this._toastrService.success(res.message);
          this.dialogRef.close(this.form.value);
        },
        error: (error) => {
          console.log(error);
          this._toastrService.error(error.error);
        }
      })
    }
  }
}
