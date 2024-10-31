import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AutomationService } from '@services/automation/automation.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.scss']
})


export class AutomationComponent implements OnInit {
  
  public form!: FormGroup;
  public loading: boolean = false;

  constructor(
      private readonly _fb: FormBuilder,
      private readonly _automationService: AutomationService,
      private readonly _toastrService: ToastrService
    ) {
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      state: [null],
      city: [null]
    });
  }

  onSubmit(){
    this.loading = !this.loading;
    this._automationService.create({...this.form.getRawValue()})
    .subscribe({
      next: (res) => {
        this.loading = !this.loading;
        this._toastrService.success(res.message)
        this.form.reset();
      },
      error: (err) => {
        this._toastrService.error('Erro ao criar automação')
      }
    })
  }

}
