import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { DialogCategoryComponent } from '@shared/dialogs/category-user/dialog-category.component';
import { DialogUserComponent } from '@shared/dialogs/dialog-user/dialog-user.component';
import { debounceTime } from "rxjs/operators";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
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

    this.dialog.open(DialogCategoryComponent, {
      width: '300px',
    })
    .afterClosed()
    .subscribe(result => {
      this.loading = !this.loading;
    });
  }
}
