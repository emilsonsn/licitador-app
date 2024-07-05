import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./views/session/session.module').then(m => m.SessionModule)
  }
];
