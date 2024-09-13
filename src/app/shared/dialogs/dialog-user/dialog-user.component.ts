import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '@services/User/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.scss']
})
export class DialogUserComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogUserComponent>,
    private _userService: UserService,
    private _toastrService: ToastrService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this._userService.createUser(this.userForm.getRawValue())
      .subscribe({
        next: (res) =>{
          this._toastrService.success(res.message);
          this.dialogRef.close(this.userForm.value);
        },
        error: (error) => {
          console.log(error);
          this._toastrService.error(error.error);
        }
      })
    }
  }
}
