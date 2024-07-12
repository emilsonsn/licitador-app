import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthLogin} from "@model/auth";
import { environment } from '@env/environment';
import {InterceptorSkipHeader} from "@services/Auth/auth-interceptor.service";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {LocalStorageService} from "@services/Help/local-storage.service";
import {TokenResponse} from "@model/TokenResponse";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private readonly _http: HttpClient,
    private readonly _storage: LocalStorageService,
    private readonly _router: Router
  ) {
    this.authStatus.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this._router.navigate(['/painel']).then();
      } else {
        this._router.navigate(['/login']).then();
      }
    });
  }

  login(auth: AuthLogin): Observable<any> {
    return this._http.post<TokenResponse>(`${environment.api}/login`, auth, {
      headers: new HttpHeaders()
        .set(InterceptorSkipHeader, '')
        .set('Custom-Header', 'true')
    }).pipe(
      tap(value => {
        this._storage.set('token', value.access_token);
        this.authStatus.next(true);
      })
    );
  }

  logout(): Observable<any> {
    return this._http.get<any>(`${environment.api}/logout`,{
      headers: new HttpHeaders()
        .set(InterceptorSkipHeader, '')
        .set('Custom-Header', 'true')
    }).pipe(
      tap(value => {
        this._storage.remove('token');
        this.authStatus.next(false);
      })
    );
  }

  private hasToken(): boolean {
    const token = this._storage.get('token');
    return !!token;
  }

}
