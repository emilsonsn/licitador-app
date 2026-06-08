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
      title: 'Cotar frete',
      description: 'Acesse os serviços de cotação de frete',
      icon: 'fa-solid fa-truck-fast',
      link: '/painel/freight-quotes'
    },
    {
      title: 'Plataforma Sicx',
      description: 'Acesse os atalhos da plataforma Sicx',
      icon: 'fa-solid fa-store',
      link: '/painel/sicx-platform'
    },
    {
      title: 'ERP + Emissor NFe',
      description: 'Emissão e gestão fiscal',
      icon: 'fa-solid fa-receipt',
      link: 'https://meuatendimento.sebrae.com.br/sites/PortalSebrae/produtoseservicos/emissornfe'
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
