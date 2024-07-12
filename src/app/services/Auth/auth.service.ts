import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthLogin} from "@model/auth";
import { environment } from '@env/environment';
import {InterceptorSkipHeader} from "@services/Auth/auth-interceptor.service";
import {Observable, tap} from "rxjs";
import {LocalStorageService} from "@services/Auth/local-storage.service";
import {TokenResponse} from "@model/TokenResponse";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly _http: HttpClient,
    private readonly _storage: LocalStorageService,
  ) {
  }

  login(auth: AuthLogin): Observable<any> {
    return this._http.post<TokenResponse>(`${environment.api}/login`, auth, {
      headers: new HttpHeaders()
        .set(InterceptorSkipHeader, '')
        .set('Custom-Header', 'true')
    }).pipe(
      tap(value => {
        this._storage.set('token', value.access_token);
      })
    );
  }

  logout(): Observable<any> {
    return this._http.get<any>(`${environment.api}/logout`);
  }

}
