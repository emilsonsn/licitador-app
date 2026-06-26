import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@env/environment";
import {Company} from "@model/company";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private readonly _http: HttpClient
  ) {
  }

  public getCompany(): Observable<any> {
    return this._http.get<any>(`${environment.api}/company`);
  }

  public createOrUpdate(company: Partial<Company> | FormData): Observable<any> {
    return this._http.post<any>(`${environment.api}/company`, company);
  }
}
