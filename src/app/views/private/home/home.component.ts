import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  tools = [
    {
      title: 'Encontrar licitações',
      description: 'Acesse as licitações',
      icon: 'fa-solid fa-magnifying-glass-chart',
      link: '/painel/home/tenders'
    },
    {
      title: 'Licitações favoritas',
      description: 'Consulte seus editais salvos',
      icon: 'fa-solid fa-star',
      link: '/painel/home/tenders/favorites'
    },
    {
      title: 'ERP + Emissor NFe',
      description: 'Emissão e gestão fiscal',
      icon: 'fa-solid fa-receipt',
      link: 'https://meuatendimento.sebrae.com.br/sites/PortalSebrae/produtoseservicos/emissornfe'
    },
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
    }
  ];

  constructor(
    private readonly _router: Router
  ) { }

  get mainTools() {
    return this.tools.filter(tool => !tool.link.startsWith('http'));
  }

  get externalTools() {
    return this.tools.filter(tool => tool.link.startsWith('http'));
  }

  navigate(link: string) {
    if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      this._router.navigate([link]).then();
    }
  }
}
