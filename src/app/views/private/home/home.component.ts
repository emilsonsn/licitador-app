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
      link: '/painel/home/tenders'
    },
    {
      title: 'Licitações favoritas',
      description: 'Acesse as licitações',
      link: '/painel/home/tenders/favorites'
    },
    {
      title: 'ERP + Emissor NFe',
      description: 'ERP + Emissor NFe',
      link: 'https://notas.licitanteprime.com.br/'
    },
      {
      title: 'Gestor de DOCs',
      description: 'Gestor de DOCs',
      link: 'https://doc.licitanteprime.com.br/'
    },
    {
      title: 'Fornecedores para Licitação',
      description: 'Fornecedores para Licitação',
      link: 'https://fornecedor.licitanteprime.com.br/'
    }

  ];

  constructor(
    private readonly _router: Router
  ) { }

  navigate(link: string) {
    if (link.startsWith('http')) {
      // Abre o link externo em uma nova aba
      window.open(link, '_blank');
    } else {
      // Navega para a rota interna
      this._router.navigate([link]).then();
    }
  }
}
