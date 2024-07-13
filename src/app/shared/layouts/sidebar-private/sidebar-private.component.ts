import {Component} from '@angular/core';
import {SidebarTypes} from "@model/SidebarTypes";

@Component({
  selector: 'app-sidebar-private',
  templateUrl: './sidebar-private.component.html',
  styleUrl: './sidebar-private.component.scss'
})
export class SidebarPrivateComponent {


  public items: SidebarTypes[] = [
    {
      type: 'link',
      label: 'Home',
      icon: 'fa fa-home',
      link: 'painel/home'
    },
  ]


  constructor() {
  }
}
