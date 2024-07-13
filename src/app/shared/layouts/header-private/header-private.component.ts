import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "@services/Auth/auth.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AnimationOptions} from "ngx-lottie";

@Component({
  selector: 'app-header-private',
  templateUrl: './header-private.component.html',
  styleUrl: './header-private.component.scss'
})
export class HeaderPrivateComponent implements OnInit, OnDestroy {
  show_dropdown = false;

  constructor(
    private readonly _AuthService: AuthService,
    private readonly _router: Router
  ) {
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.show_dropdown = !this.show_dropdown;
  }

  ngOnInit() {
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.show_dropdown = false;
    }
  }

  logout() {
    this._AuthService.logout();
  }

  options: AnimationOptions = {
    path: '/assets/images/Animation_megaphone.json',
  };

}
