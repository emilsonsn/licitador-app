import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {
  }

  getDashboardData(): Observable<any> {
    return this.http.get<any>(`${environment.api}/dashboard/search`);
  }

  getIndicators(): Observable<any> {
    return this.http.get<any>(`${environment.api}/dashboard/indicators`);
  }

  getUserGraph(params: any): Observable<any> {
    const httpParams = new HttpParams().set('period', params.period);
    return this.http.get<any>(`${environment.api}/dashboard/userGraph`, {params: httpParams});
  }
}
