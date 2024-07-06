import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AnimationOptions} from "ngx-lottie";

@Component({
  selector: 'app-to-recover',
  templateUrl: './to-recover.component.html',
  styleUrl: './to-recover.component.scss'
})
export class ToRecoverComponent {

  constructor(private router: Router) {
  }


  submit() {

  }

  navigate() {
    this.router.navigate(['/login']).then();
  }

  options: AnimationOptions = {
    path: '/assets/images/animation_no_recover.json',
  };
}
