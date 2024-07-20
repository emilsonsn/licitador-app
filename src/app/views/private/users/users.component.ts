import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  public form!: FormGroup;
  public searchTerm: string = '';

  constructor(private readonly _fb: FormBuilder) {
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
}
