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
      title: "Loggi",
      description: "Frete com a Loggi",
      icon: 'fa-solid fa-box',
      link: "https://www.loggi.com/pt-br/calcular-frete/"
    },
    {
      title: "Correios",
      description: "Frete com os Correios",
      icon: 'fa-solid fa-envelopes-bulk',
      link: "https://www2.correios.com.br/sistemas/precosPrazos/"
    },
    {
      title: "Rodonaves",
      description: "Frete com a Rodonaves",
      icon: 'fa-solid fa-road',
      link: "https://rodonavesexpress.rte.com.br/express/"
    }
  ];

  constructor(
    private readonly _router: Router
  ) { }

  ngOnInit(){
    this.startTour('home');
  }

  get mainTools() {
    return this.tools.filter(tool => !tool.link.startsWith('http'));
  }

  get externalTools() {
    return this.tools.filter(tool => tool.link.startsWith('http'));
  }

  public startTour(tour: string, init = false): void {
      let tourString = localStorage.getItem('tour') ?? '[]';
      let storage_tour = JSON.parse(tourString);    
      if(init || !storage_tour.includes(tour)){
          const intro = introJs();
          intro.setOptions({
            steps: [
              {
                intro: `Bem vindo!
                Esse é o seu primeiro acesso, obrigado :)`
              },
              {
                element: '.quick-access',
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
