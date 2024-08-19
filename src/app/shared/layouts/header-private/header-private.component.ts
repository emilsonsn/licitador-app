import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "@services/Auth/auth.service";
import {Router} from "@angular/router";
import {AnimationOptions} from "ngx-lottie";
import {User} from "@model/User";
import {SettingsService} from "@services/settings/settings.service";
import {environment} from "@env/environment";
import {MatDialog} from "@angular/material/dialog";
import {UserModalComponent} from "@shared/dialogs/user-modal/user-modal.component";

@Component({
  selector: 'app-header-private',
  templateUrl: './header-private.component.html',
  styleUrl: './header-private.component.scss'
})
export class HeaderPrivateComponent implements OnInit, OnDestroy {
  show_dropdown = false;
  user: User | null = null;

  title: string = ''
  subtitle: string = ''
  banner: any = null

  constructor(
    private readonly _AuthService: AuthService,
    private readonly _router: Router,
    private dialog: MatDialog,
    private settingsService: SettingsService
  ) {

    this._AuthService.getUser().subscribe(value => {
      if (value) {
        this.user = value?.data;
      } else {
        this.user = null;
      }
    });

    this.settingsService.getSettings().subscribe(response => {
      if (response.status) {
        this.title = response.data.title
        this.subtitle = response.data.subtitle
        this.banner = `${environment.api.replace('/api', '')}/storage/` + response.data.banner


      } else {
        // Handle error
        console.error(response.error);
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

  openUserModal() {

    console.log(this.user);

    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '300px',
      data: this.user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dados do usuário:', result);
        // Você pode enviar os dados para o backend ou fazer outras ações aqui
      }
    });
  }
}
