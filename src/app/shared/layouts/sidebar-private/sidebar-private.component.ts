import { Component, OnInit } from '@angular/core';
import { SidebarTypes } from "@model/SidebarTypes";
import { Router } from "@angular/router";
import { AuthService } from "@services/Auth/auth.service";
import { User } from "@model/User";

@Component({
  selector: 'app-sidebar-private',
  templateUrl: './sidebar-private.component.html',
  styleUrls: ['./sidebar-private.component.scss']
})
export class SidebarPrivateComponent implements OnInit {
  public items: SidebarTypes[] = [];
  public adminItems: SidebarTypes[] = [];
  private allItems: SidebarTypes[] = [
    {
      type: 'link',
      label: 'Home',
      icon: 'fa fa-home',
      link: 'painel/home',
    },
    {
      type: 'link',
      label: 'Encontrar licitações',
      icon: 'fa-solid fa-magnifying-glass-chart',
      link: 'painel/home/tenders',
    },
    {
      type: 'link',
      label: 'Licitações Favoritas',
      icon: 'fa-solid fa-star',
      link: 'painel/home/tenders/favorites',
    },
    {
      type: 'link',
      label: 'Cotar frete',
      icon: 'fa-solid fa-truck-fast',
      link: 'painel/freight-quotes',
    },
    {
      type: 'link',
      label: 'Plataforma Sicx',
      icon: 'fa-solid fa-store',
      link: 'painel/sicx-platform',
    },
    {
      type: 'link',
      label: 'Dashboard',
      icon: 'fa-solid fa-chart-simple',
      link: 'painel/dashboard',
      private: true
    },
    {      
      type: 'link',
      label: 'Categoria',
      icon: 'fa-solid fa-list',
      link: 'painel/category',
      private: true
    },
    {      
      type: 'link',
      label: 'Documentos',
      icon: 'fa-solid fa-file',
      link: 'painel/document',
      private: false
    },
    {
      type: 'link',
      label: 'Empresa',
      icon: 'fa-solid fa-building',
      link: 'painel/company',
      private: false
    },
    {
      type: 'link',
      label: 'Calendário',
      icon: 'fa-solid fa-calendar-days',
      link: 'painel/calendar',
      private: false
    },
    {      
      type: 'link',
      label: 'Automações de busca',
      icon: 'fa-solid fa-magnifying-glass-plus',
      link: 'painel/automation',
      private: true
    },
    {
      type: 'link',
      label: 'Usuários',
      icon: 'fa-solid fa-users',
      link: 'painel/users',
      private: true
    },
    {
      type: 'link',
      label: 'Ajuda',
      icon: 'fa-solid fa-circle-info',
      link: 'painel/help',
    },
    {
      type: 'link',
      label: 'Configuração',
      icon: 'fa-solid fa-gear',
      link: 'painel/settings',
      private: true
    },
  ];

  public user: User | null = null;

  constructor(
    private readonly _router: Router,
    private readonly _AuthService: AuthService,
  ) {}

  ngOnInit(): void {
    this._AuthService.getUser().subscribe({
      next: (value) => {
        this.user = value?.data ?? null;
        this.filterItems();
      },
      error: (err) => {
        console.error('Failed to fetch user:', err);
        this.user = null;
        this.filterItems();
      }
    });
  }

  private filterItems(): void {
    if (this.user && this.user.is_admin) {
      this.items = this.allItems.filter(item => !item.private);
      this.adminItems = this.allItems.filter(item => item.private);
    } else {
      this.items = this.allItems.filter(item => !item.private);
      this.adminItems = [];
    }
  }

  navigate(link: string): void {
    this._router.navigate([link]).then();
  }

  isActive(link: string): boolean {
    return this._router.url === '/' + link;
  }  
}
