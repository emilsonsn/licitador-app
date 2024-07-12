import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {LocalStorageService} from "@services/Help/local-storage.service";

export const authGuard: CanActivateFn = (route, state) => {
  const is_token = !!inject(LocalStorageService).get('token');
  const router = inject(Router);

  if (is_token && state.url === '/login') {
    router.navigate(['painel']).then();
    return false;
  }

  if (!is_token && state.url === '/login') {
    return true;
  }

  if (!is_token && state.url !== '/login') {
    router.navigate(['login']).then();
    return false;
  }

  return is_token;

};
