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
export class DocumentService {

  constructor(
    private readonly _http: HttpClient
  ) {
  }

  public search(pageControl: PageControl, filters?: any): Observable<any> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get(`${environment.api}/file/search?${paginate}${filterParams}`);
  }

  public create(user: any): Observable<any> {
    return this._http.post<any>(`${environment.api}/file/create`, user);
  }

  public patch(id?: number, user?: any): Observable<any> {
    return this._http.post<any>(`${environment.api}/file/${id}?_method=PATCH`, user);
  }

  public delete(id: number): Observable<any> {
    return this._http.delete<any>(`${environment.api}/file/${id}`, {});
  }
}
