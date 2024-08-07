import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PageControl} from "@model/application";
import {Observable} from "rxjs";
import {Utils} from "@shared/utils";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class TenderService {

  constructor(
    private readonly _http: HttpClient,
  ) { }

  public getTenders(pageControl: PageControl, filters?: any): Observable<any> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get(`${environment.api}/tender/search?${paginate}${filterParams}`);
  }

  public favorite(id: number): Observable<any> {
    return this._http.post(`${environment.api}/tender/favorite/${id}`, {});
  }
}
