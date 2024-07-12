import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {LocalStorageService} from "@services/Help/local-storage.service";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  return !!inject(LocalStorageService).get('token');
};

