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
export class UserService {

  constructor(
    private readonly _http: HttpClient
  ) {
  }

  public getUsers(pageControl: PageControl, filters?: any): Observable<any> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get(`${environment.api}/user/search?${paginate}${filterParams}`);
  }

  public createUser(user: any): Observable<any> {
    return this._http.post<any>(`${environment.api}/user/create`, user);
  }

  public patchUser(id: number, user: any): Observable<any> {
    return this._http.patch<any>(`${environment.api}/user/${id}`, user);
  }

  public blockUser(id: number): Observable<any> {
    return this._http.post<any>(`${environment.api}/user/block/${id}`, {});
  }
}
