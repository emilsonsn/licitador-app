import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '@model/User';
import { AuthService } from '@services/Auth/auth.service';
import { UserService } from '@services/User/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-business',
  templateUrl: './user-business.component.html',
  styleUrls: ['./user-business.component.scss']
})
export class UserBusinessComponent implements OnInit {

  clienteForm: FormGroup = this.fb.group({});  
  empresaForm: FormGroup = this.fb.group({});
  user: any;

  constructor(
    private fb: FormBuilder,
    private readonly _userService: UserService,
    private readonly _AuthService: AuthService,
    private readonly _toastrService: ToastrService

  ) {}

  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      name: [''],
      surname: [''],
      email: [''],
      birthday: [''],
      postalcode: [''],
      address: [''],
      city: [''],
      state: ['']
    });

    this.empresaForm = this.fb.group({
      cnpj: [''],
      corporate_reason: [''],
      fantasy_name: [''],
      opening_date: ['']
    });

    this.getuser();
    
  }

  getuser(){
    this._AuthService.getUser().subscribe(value => {
      if (value) {
        this.user = value?.data;
        this.clienteForm.patchValue(this.user);
        this.empresaForm.patchValue(this.user);
      }
    });
  }

  onClientSubmit(): void {
    const clienteData = this.clienteForm.value;

    this._userService.patchUser(this.user.id, clienteData)
    .subscribe(data => {
        this._toastrService.success('Dados atualizados com sucesso!');
    });
  }

  onBusinessSubmit(): void {
    const empresaData = this.empresaForm.value;

    this._userService.patchUser(this.user.id, empresaData)
    .subscribe(data => {
      this._toastrService.success('Dados atualizados com sucesso!');
    });

  }
}
