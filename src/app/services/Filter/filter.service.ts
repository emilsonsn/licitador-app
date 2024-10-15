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
export class FilterService {

  constructor(
    private readonly _http: HttpClient
  ) {
  }

  public getFilter(): Observable<any> {
    return this._http.get(`${environment.api}/filter`);
  }

  public createFilter(filter: any): Observable<any> {
    return this._http.post<any>(`${environment.api}/filter`, filter);
  }
}
