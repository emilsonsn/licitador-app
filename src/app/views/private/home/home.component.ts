import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  tools = [
    {
      title: 'Encontrar licitações',
      description: 'Acesse as licitações',
      link: '/painel/tenders'
    }
  ]

  constructor(
    private readonly _router: Router
  ) { }

  navigate(link: string) {
    this._router.navigate([link]).then();
  }

}
