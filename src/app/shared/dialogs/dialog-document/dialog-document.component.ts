import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '@model/category';
import { Document } from '@model/document';
import { CategoryService } from '@services/Category/category.service';
import { DocumentService } from '@services/Document/document.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-document',
  templateUrl: './dialog-document.component.html',
  styleUrls: ['./dialog-document.component.scss']
})
export class DialogDocumentComponent {
  form: FormGroup;
  categories: Category[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Document,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogDocumentComponent>,
    private _documentService: DocumentService,
    private _toastrService: ToastrService,
    private _categoryService: CategoryService,
    
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      expiration_date: ['', Validators.required],
      file: [''],
      category_id: ['', Validators.required],
    });
    this.form.patchValue(data);
  }

  ngOnInit(){
    this.getCategory();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ file });
    }
  }

  getCategory(){
    this._categoryService.all()
    .subscribe({
      next: (res) => {
        this.categories = res.data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = new FormData();
      const formValues = this.form.getRawValue();

      // Adiciona os valores do formulário ao FormData
      Object.keys(formValues).forEach(key => {
        formData.append(key, formValues[key]);
      });

      if(this.data){
        this.update(formData);
      }
      else{
        this.create(formData);
      }

    }
  }

  create(formData: FormData){
    this._documentService.create(formData).subscribe({
      next: (res) => {
        this._toastrService.success(res.message);
        this.dialogRef.close(this.form.value);
      },
      error: (error) => {
        console.log(error);
        this._toastrService.error(error.error);
      }
    });
  }

  update(formData: FormData){
    this._documentService.patch(this.data.id, formData).subscribe({
      next: (res) => {
        this._toastrService.success(res.message);
        this.dialogRef.close(this.form.value);
      },
      error: (error) => {
        console.log(error);
        this._toastrService.error(error.error);
      }
    });
  }
}
