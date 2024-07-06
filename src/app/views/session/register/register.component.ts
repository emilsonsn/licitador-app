import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AnimationOptions} from "ngx-lottie";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private router: Router) {
  }


  submit() {

  }

  navigate() {
    this.router.navigate(['/login']).then();
  }

  options: AnimationOptions = {
    path: '/assets/images/animation_register.json',
  };
}
