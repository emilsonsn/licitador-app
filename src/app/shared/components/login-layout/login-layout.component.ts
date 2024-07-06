import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.scss'
})
export class LoginLayoutComponent {
  @Input() title: string = "";
  @Input() primaryBtnText: string = "";
  @Input() secondaryBtnText: string = "";
  @Output("submit") onSubmit = new EventEmitter();
  @Output("navigate") onNavigate = new EventEmitter();

  navigate() {
    this.onNavigate.emit();
  }

  submit() {
    this.onSubmit.emit();
  }

  options: AnimationOptions = {
    path: '/assets/images/animation_login.json',
  };

}
