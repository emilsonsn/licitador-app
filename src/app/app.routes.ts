import {Routes} from '@angular/router';
import {environment} from "@env/environment";
import {authGuard} from "@app/guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./views/session/session.module').then(m => m.SessionModule),

  },
  {
    path: 'painel',
    loadChildren: () => import('./views/private/private.module').then(m => m.PrivateModule),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: environment.home,
  }

];
