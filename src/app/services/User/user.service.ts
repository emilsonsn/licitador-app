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
}
