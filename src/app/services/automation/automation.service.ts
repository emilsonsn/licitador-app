import {Injectable} from '@angular/core';
import {ApiResponsePageable, PageControl} from "@model/application";
import {Observable} from "rxjs";
import {User} from "@model/User";
import {environment} from "@env/environment";
import {Utils} from "@shared/utils";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AutomationService {

  constructor(
    private readonly _http: HttpClient
  ) {
  }

  public search(): Observable<any> {
    return this._http.get(`${environment.api}/automation/search`);
  }

  public create(automation: any): Observable<any> {
    return this._http.post<any>(`${environment.api}/automation/create`, automation);
  }
}
