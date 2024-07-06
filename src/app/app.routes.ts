import { Routes } from '@angular/router';
import {environment} from "@env/environment";

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./views/session/session.module').then(m => m.SessionModule)
  },
  {
    path: '**',
    redirectTo: environment.home
  }
];
