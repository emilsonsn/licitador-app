import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AnimationOptions} from "ngx-lottie";
import {AuthService} from "@services/Auth/auth.service";
import {AuthLogin} from "@model/auth";
import {take} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup
  isPasswordVisible: boolean = false;
  error: boolean = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  constructor(
    private readonly _AuthService: AuthService,
    private readonly _router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
  }

  submit() {
    if (this.loginForm.valid) {
      const auth: AuthLogin = this.loginForm.value;
      this._AuthService.login(auth)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.error = false;
          },
          error: () => {
            this.error = true;
          }
        });
    } else {
      console.log("invalid form");
    }
  }

  toRecover() {
    this._router.navigate(['/to-recover']).then();
  }

  options: AnimationOptions = {
    path: '/assets/images/animation_login.json',
  };

}
