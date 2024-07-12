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
  @Input() disablePrimaryBtn: boolean = false;
  @Input() disableSecondaryBtn: boolean = false;
  @Input() is_secondaryBtn: boolean = true;
  @Input() options: AnimationOptions = {};
  @Output("primaryBtn") primaryBtn = new EventEmitter();
  @Output("secondaryBtn") secondaryBtn = new EventEmitter();
  @Input() text_main: string = "";

  navigate() {
    this.secondaryBtn.emit();
  }

  submit() {
    this.primaryBtn.emit();
  }

}
