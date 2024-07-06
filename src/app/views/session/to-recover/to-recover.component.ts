import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AnimationOptions} from "ngx-lottie";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-to-recover',
  templateUrl: './to-recover.component.html',
  styleUrl: './to-recover.component.scss'
})
export class ToRecoverComponent {
  recoverForm!: FormGroup


  constructor(private router: Router) {
    this.recoverForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }


  submit() {
    if (this.recoverForm.valid) {
      console.log(this.recoverForm.value);
    }
  }

  navigate() {
    this.router.navigate(['/login']).then();
  }

  options: AnimationOptions = {
    path: '/assets/images/animation_no_recover.json',
  };
}
