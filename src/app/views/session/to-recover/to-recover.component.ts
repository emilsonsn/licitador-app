import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { AnimationOptions } from "ngx-lottie";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@services/Auth/auth.service";

@Component({
  selector: 'app-to-recover',
  templateUrl: './to-recover.component.html',
  styleUrls: ['./to-recover.component.scss']
})
export class ToRecoverComponent {
  recoverForm!: FormGroup;
  primaryBtnText: string = "Continuar";
  disablePrimaryBtn: boolean = false;
  showInput: boolean = true;
  countdown: number = 60;
  intervalId: any;

  constructor(
    private readonly _AuthService: AuthService,
    private readonly router: Router
  ) {
    this.recoverForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  submit() {
    if (this.recoverForm.valid) {
      this.showInput = false;
      this.disablePrimaryBtn = true;
      this._AuthService.recoverPassword(this.recoverForm.get("email")?.value).subscribe(
        {
          next: () => {
            this.startCountdown();
          },
          error: () => {
            this.showInput = true;
            this.disablePrimaryBtn = false;
          }
        }
      );
    }
  }

  startCountdown() {
    this.disablePrimaryBtn = true;
    this.primaryBtnText = `Reenviar (${this.countdown}s)`;
    this.intervalId = setInterval(() => {
      this.countdown--;
      this.primaryBtnText = `Reenviar (${this.countdown}s)`;
      if (this.countdown === 0) {
        clearInterval(this.intervalId);
        this.disablePrimaryBtn = false;
        this.primaryBtnText = "Reenviar";
        this.countdown = 60; // Reset countdown
      }
    }, 1000);
  }

  navigate() {
    this.router.navigate(['/login']).then();
  }

  options: AnimationOptions = {
    path: '/assets/images/animation_no_recover.json',
  };
}
