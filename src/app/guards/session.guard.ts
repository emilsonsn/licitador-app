import {CanActivateFn, Router} from '@angular/router';
import {LocalStorageService} from "@services/Help/local-storage.service";
import {inject} from "@angular/core";

export const sessionGuard: CanActivateFn = (route, state) => {
  const exist_token = !!inject(LocalStorageService).get('token');
  const router = inject(Router);
  if (exist_token){
    router.navigate(['/painel/home']).then();
    return false;
  }
  return true;
};
