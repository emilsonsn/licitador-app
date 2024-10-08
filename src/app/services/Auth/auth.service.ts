import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthLogin} from "@model/auth";
import {environment} from '@env/environment';
import {BehaviorSubject, Observable, of, tap} from "rxjs";
import {LocalStorageService} from "@services/Help/local-storage.service";
import {TokenResponse} from "@model/TokenResponse";
import {ActivatedRoute, Router} from "@angular/router";
import {InterceptorSkipHeader} from "@services/Auth/auth.interceptor";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  code: string = '';

  constructor(
    private readonly _http: HttpClient,
    private readonly _storage: LocalStorageService,
    private readonly _router: Router,
    private route: ActivatedRoute,
  ) {

    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
    });

    this.authStatus.subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        if (!this.code) {
          this._router.navigate(['/login']).then();
        }
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
        this._router.navigate(['/painel/home']).then();
      })
    );
  }

  logout(): Observable<any> {
    this._http.post<any>(`${environment.api}/logout`, {}).subscribe(
      () => {
        this._storage.remove('token');
        this.authStatus.next(false);
      }
    );

    return of(null);
  }

  recoverPassword(email: string): Observable<any> {
    return this._http.post<any>(`${environment.api}/recoverPassword`, {email});
  }

  updatePassword(data: { code: string, password: string }): Observable<any> {
    return this._http.post<any>(`${environment.api}/updatePassword`, data);
  }

  private hasToken(): boolean {
    const token = this._storage.get('token');
    return !!token;
  }

  getUser(): Observable<any> {
    return this._http.get<any>(`${environment.api}/user/getUser`);
  }

}
