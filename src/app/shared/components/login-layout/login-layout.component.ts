import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.scss'
})
export class LoginLayoutComponent {
  @Input() titlePrimary: string = "";
  @Input() primaryBtnText: string = "";
  @Input() secondaryBtnText: string = "";
  @Input() options: AnimationOptions = {};
  @Output("submit") onSubmit = new EventEmitter();
  @Output("navigate") onNavigate = new EventEmitter();
  @Input() text_main: string = "";

  navigate() {
    this.onNavigate.emit();
  }

  submit() {
    this.onSubmit.emit();
  }

}
