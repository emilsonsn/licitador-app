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
export class CategoryService {

  constructor(
    private readonly _http: HttpClient
  ) {
  }

  public all(): Observable<any> {
    return this._http.get(`${environment.api}/category/all`);
  }

  public search(pageControl: PageControl, filters?: any): Observable<any> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get(`${environment.api}/category/search?${paginate}${filterParams}`);
  }

  public create(user: any): Observable<any> {
    return this._http.post<any>(`${environment.api}/category/create`, user);
  }

  public patch(id: number, user: any): Observable<any> {
    return this._http.patch<any>(`${environment.api}/category/${id}`, user);
  }

  public delete(id: number): Observable<any> {
    return this._http.delete<any>(`${environment.api}/category/${id}`, {});
  }
}
