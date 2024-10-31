import { Component } from '@angular/core';
import { Router } from '@angular/router';
import introJs from 'intro.js';

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

  ngOnInit(){
    this.startTour('home');
  }

  private startTour(tour: string): void {
      let tourString = localStorage.getItem('tour') ?? '[]';
      let storage_tour = JSON.parse(tourString);    
      if(!storage_tour.includes(tour)){
          const intro = introJs();
          intro.setOptions({
            steps: [
              {
                intro: `Bem vindo!
                Esse é o seu primeiro acesso, obrigado :)`
              },
              {
                element: 'h4 + .content',
                intro: "Aqui temos os botões para acessar as ferramentas",
                position: 'left'
              },
              {
                element: '.container-buttons .dropdown',
                intro: 'Aqui você terá acesso ao seu perfil',
                position: 'left'
              }   
            ],
            nextLabel: 'Próximo',
            prevLabel: 'Anterior',
            skipLabel: '×',
            doneLabel: 'Concluir'
          });
          intro.start();
          storage_tour.push(tour)
          localStorage.setItem('tour',JSON.stringify(storage_tour))
      }
  }

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
