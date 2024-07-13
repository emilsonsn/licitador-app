import { Component } from '@angular/core';
import { SidebarTypes } from "@model/SidebarTypes";
import { Router } from "@angular/router";

@Component({
  selector: 'app-sidebar-private',
  templateUrl: './sidebar-private.component.html',
  styleUrls: ['./sidebar-private.component.scss']
})
export class SidebarPrivateComponent {
  public items: SidebarTypes[] = [
    {
      type: 'link',
      label: 'Home',
      icon: 'fa fa-home',
      link: 'painel/home'
    },
    {
      type: 'link',
      label: 'Dashboard',
      icon: 'fa-solid fa-chart-simple',
      link: 'painel/dashboard'
    },
    {
      type: 'link',
      label: 'Usuários',
      icon: 'fa-solid fa-users',
      link: 'painel/users'
    },
    {
      type: 'link',
      label: 'Ajuda',
      icon: 'fa-solid fa-circle-info',
      link: 'painel/help'
    },
  ];

  constructor(
    private readonly _router: Router
  ) { }

  navigate(link: string) {
    this._router.navigate([link]).then();
  }

  isActive(link: string): boolean {
    return this._router.url.includes(link);
  }
}
