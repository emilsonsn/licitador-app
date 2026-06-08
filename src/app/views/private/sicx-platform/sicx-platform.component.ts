import { Component } from '@angular/core';

@Component({
  selector: 'app-sicx-platform',
  templateUrl: './sicx-platform.component.html',
  styleUrl: './sicx-platform.component.scss'
})
export class SicxPlatformComponent {
  platformTools = [
    {
      title: 'Mercadário',
      description: 'Acesse o Mercadário',
      icon: 'fa-solid fa-store',
      link: 'https://mercadario.com.br/'
    },
    {
      title: 'Portal de Compras Públicas',
      description: 'Acesse o marketplace',
      icon: 'fa-solid fa-cart-shopping',
      link: 'https://marketplace.portaldecompraspublicas.com.br/'
    }
  ];

  openLink(link: string): void {
    window.open(link, '_blank');
  }
}
