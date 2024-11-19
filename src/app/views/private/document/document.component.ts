import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { DialogCategoryComponent } from '@shared/dialogs/category-user/dialog-category.component';
import { DialogDocumentComponent } from '@shared/dialogs/dialog-document/dialog-document.component';
import { DialogUserComponent } from '@shared/dialogs/dialog-user/dialog-user.component';
import { debounceTime } from "rxjs/operators";

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent {
  public form!: FormGroup;
  public searchTerm: string = '';  
  public loading: boolean = true;  
  
  constructor(
    private readonly _fb: FormBuilder,
    private dialog: MatDialog,
  ) {}

  ngOnInit(){
    this.form = this._fb.group({
      searchTerm: [null],
    });

    this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {
        this.searchTerm = value.searchTerm;
      });

  }

  public clearSearchTerm(): void {
    this.form.patchValue({ searchTerm: '' });
  }

  public onAddButton(){
    this.dialog.open(DialogDocumentComponent, {
      width: '400px',
    })
    .afterClosed()
    .subscribe(result => {
      this.loading = !this.loading;
    });
  }
}
