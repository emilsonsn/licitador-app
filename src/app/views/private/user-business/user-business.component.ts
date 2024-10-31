import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '@model/User';
import { AuthService } from '@services/Auth/auth.service';
import { UserService } from '@services/User/user.service';
import introJs from 'intro.js';
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
      phone: [''],
      has_notification :[false],
      birthday: [''],
      postalcode: [''],
      address: [''],
      city: [''],
      state: [''],
      password: [''],
      confirm_password: ['']
    });

    this.empresaForm = this.fb.group({
      cnpj: [''],
      corporate_reason: [''],
      fantasy_name: [''],
      opening_date: ['']
    });

    this.getuser();
    this.startTour('user-business');
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

    if(clienteData.password && clienteData.password.length < 8){
      this._toastrService.warning('A senha deve ter pelo menos 8 caracteres.')
      return;      
    }

    if(clienteData.password != clienteData.confirm_password){
      this._toastrService.warning('Senhas não coincidem.')
      return;
    }

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

  private startTour(tour: string): void {
    let tourString = localStorage.getItem('tour') ?? '[]';
    let storage_tour = JSON.parse(tourString);    
    if(!storage_tour.includes(tour)){
        const intro = introJs();
        intro.setOptions({
          steps: [
            {
              intro: `Essa é a página com os dados do seu perfil e empresa.`
            },
            {
              element: '#cliente',
              intro: "Adicione seu dados aqui",
              position: 'left'
            },
            {
              element: '#phone',
              intro: 'Confira seu numero de whastapp para receber as notificações.`,',
              position: 'left'
            },
            {
              element: '#hasNotification',
              intro: 'Clique no botão para receber notificação de novos editais do seu estado no seu whatsapp',
              position: 'left'
            }   
            
          ],
          nextLabel: 'Próximo',
          prevLabel: 'Anterior',
          skipLabel: '×',
          doneLabel: 'Concluir'
        });
        intro.start();
        storage_tour.push(tour)
        localStorage.setItem('tour',JSON.stringify(storage_tour))
    }
}
}
