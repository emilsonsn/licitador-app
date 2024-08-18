import {Component} from '@angular/core';
import {AnimationOptions} from "ngx-lottie";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "@services/Auth/auth.service";

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.scss'
})
export class PasswordRecoveryComponent {

  options: AnimationOptions = {
    path: '/assets/images/animation_password_recovery.json',
  };
  recoveryForm: FormGroup;
  code!: string;
  error: boolean = false;
  isPasswordVisible: boolean = false;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute, private readonly _router: Router,
    private readonly _authService: AuthService
  ) {
    this.recoveryForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  submit() {
    if (this.recoveryForm.valid) {
      const {password, confirmPassword} = this.recoveryForm.value;

      if (password !== confirmPassword) {
        this.error = true;
        this.message = 'As senhas não coincidem!';
        return;
      }

      // Aqui você pode enviar o código e a nova senha para o backend
      const recoveryData = {
        code: this.code,
        password: password
      };

      this._authService.updatePassword(recoveryData).subscribe(res => {
        if (res.status) {
          this._router.navigate(['/login']).then();
        } else {
          this.error = true;
          this.message = res.error;
        }
      });

      console.log('Dados enviados:', recoveryData);

      // Substitua o console.log pelo seu código de envio, por exemplo:
      // this.yourService.resetPassword(recoveryData).subscribe(response => {
      //   console.log('Resposta do servidor:', response);
      // });
    }
  }

  navigate() {
    this._router.navigate(['/login']).then();
  }
}
