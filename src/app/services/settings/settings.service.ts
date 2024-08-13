import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private apiUrl = `${environment.api}/setting`;

  constructor(private http: HttpClient) {
  }

  getSettings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search`);
  }

  updateSettings(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update?_method=PATCH`, data);
  }

  getBanner(urlPath: string): Observable<any> {
    // Supondo que environment.api tenha o valor 'https://example.com/api'
    return this.http.get<any>(`${environment.api.replace('/api', '')}/storage/${urlPath}`);

  }
}
