import { Component } from '@angular/core';

@Component({
  selector: 'app-freight-quotes',
  templateUrl: './freight-quotes.component.html',
  styleUrl: './freight-quotes.component.scss'
})
export class FreightQuotesComponent {
  freightTools = [
    {
      title: 'Melhor envio',
      description: 'Cotação de frete',
      icon: 'fa-solid fa-truck-fast',
      link: 'https://melhorenvio.com.br/p/tw2ekrx0WR'
    },
    {
      title: 'Jamef',
      description: 'Frete com a Jamef',
      icon: 'fa-solid fa-truck',
      link: 'https://www.jamef.com.br/cotacao-de-frete'
    },
    {
      title: 'Loggi',
      description: 'Frete com a Loggi',
      icon: 'fa-solid fa-box',
      link: 'https://www.loggi.com/pt-br/calcular-frete/'
    },
    {
      title: 'Correios',
      description: 'Frete com os Correios',
      icon: 'fa-solid fa-envelopes-bulk',
      link: 'https://www2.correios.com.br/sistemas/precosPrazos/'
    },
    {
      title: 'Rodonaves',
      description: 'Frete com a Rodonaves',
      icon: 'fa-solid fa-road',
      link: 'https://rodonavesexpress.rte.com.br/express/'
    },
    {
      title: 'Cargas.com.br',
      description: 'Cotação de frete',
      icon: 'fa-solid fa-boxes-stacked',
      link: 'https://www.cargas.com.br/'
    }
  ];

  openLink(link: string): void {
    window.open(link, '_blank');
  }
}
