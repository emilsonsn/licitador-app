import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {mergeMap, tap} from 'rxjs/operators';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {LocalStorageService} from "@services/Help/local-storage.service";

export const InterceptorSkipHeader = 'X-Skip-Interceptor';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const _router = inject(Router);
  const _storage = inject(LocalStorageService);

  return of(_storage.get('token')).pipe(
    mergeMap(isAuthenticated => {
      const token = _storage.get('token');

      if (isAuthenticated && token) {
        return setJwtOrSkip(request, next, token, _router);
      }

      const customHeaderValue = request.headers.get('Custom-Header');
      const headers = request.headers.delete(InterceptorSkipHeader);
      request = request.clone({headers});
      return next(request).pipe(tap({
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              return;
            }
            if (!customHeaderValue) _router.navigate(['login']).then();
          }
        }
      }));
    })
  );
};

function setJwtOrSkip(request: HttpRequest<any>, next: HttpHandlerFn, jwt: string, _router: Router): Observable<HttpEvent<any>> {
  if (!request.headers.has(InterceptorSkipHeader)) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${jwt}`
      }
    });
  } else {
    const headers = request.headers.delete(InterceptorSkipHeader);
    request = request.clone({headers});
  }
  return next(request)
    .pipe(tap({
      error: (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401) {
            return;
          }
          const customHeaderValue = request.headers.get('Custom-Header');

          if (!customHeaderValue) _router.navigate(['login']).then();
        }
      }
    }));
}
