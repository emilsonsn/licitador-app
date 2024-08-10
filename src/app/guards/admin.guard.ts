import { CanActivateFn } from '@angular/router';
import { inject } from "@angular/core";
import { AuthService } from "@services/Auth/auth.service";
import { User } from "@model/User";
import { map, catchError, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).getUser().pipe(
    map((value) => {
      const user = value?.data as User;
      return !!user?.is_admin;
    }),
    catchError((err) => {
      console.error('Failed to fetch user:', err);
      return of(false);
    })
  );
};
