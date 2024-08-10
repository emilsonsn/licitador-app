import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "@services/Auth/auth.service";
import {Router} from "@angular/router";
import {AnimationOptions} from "ngx-lottie";
import {User} from "@model/User";

@Component({
  selector: 'app-header-private',
  templateUrl: './header-private.component.html',
  styleUrl: './header-private.component.scss'
})
export class HeaderPrivateComponent implements OnInit, OnDestroy {
  show_dropdown = false;
  user: User | null = null;

  constructor(
    private readonly _AuthService: AuthService,
    private readonly _router: Router
  ) {

    this._AuthService.getUser().subscribe(value => {
      if (value) {
        this.user = value?.data;
      } else {
        this.user = null;
      }
    });
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
