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
  private allItems: SidebarTypes[] = [
    {
      type: 'link',
      label: 'Home',
      icon: 'fa fa-home',
      link: 'painel/home',
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
      this.items = this.allItems; // Show all items for admin users
    } else {
      this.items = this.allItems.filter(item => !item.private);
    }
  }

  navigate(link: string): void {
    this._router.navigate([link]).then();
  }

  isActive(link: string): boolean {
    return this._router.url.includes(link);
  }
}
