import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageService} from "@services/Auth/local-storage.service";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {mergeMap, Observable, of, tap} from "rxjs";

export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private readonly _storage: LocalStorageService,
    private readonly _router: Router
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return of(this._storage.get('token')).pipe(
      mergeMap(isAuthenticated => {
        const token = this._storage.get('token');

        if (isAuthenticated && token) {
          return this.setJwtOrSkip(request, next, token);
        }

        const customHeaderValue = request.headers.get('Custom-Header');
        const headers = request.headers.delete(InterceptorSkipHeader);
        request = request.clone({headers});
        return next.handle(request).pipe(tap({
          error: (err) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status !== 401) {
                return;
              }
              if (!customHeaderValue) this._router.navigate(['login']).then();
            }
          }
        }));
      })
    );
  }

  private setJwtOrSkip(request: HttpRequest<any>, next: HttpHandler, jwt: string): Observable<HttpEvent<any>> {
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
    return next.handle(request)
      .pipe(tap({
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              return;
            }
            const customHeaderValue = request.headers.get('Custom-Header');

            if (!customHeaderValue) this._router.navigate(['login']).then();
          }
        }
      }));
  }

}
