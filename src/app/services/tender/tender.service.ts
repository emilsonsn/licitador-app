import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PageControl} from "@model/application";
import {Observable} from "rxjs";
import {Utils} from "@shared/utils";
import {environment} from "@env/environment";
import {CalendarTenderStatus, Note} from '@model/tender';

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

  public delete(id: number): Observable<any> {
    return this._http.delete(`${environment.api}/tender/${id}`);
  }

  public favorite(id: number): Observable<any> {
    return this._http.post(`${environment.api}/tender/favorite/${id}`, {});
  }

  public calendar(filters?: { status?: string | string[] }): Observable<any> {
    const filterParams = Utils.mountPageControl({
      status: Array.isArray(filters?.status) ? filters?.status.join(',') : filters?.status ?? ''
    } as any);

    return this._http.get(`${environment.api}/tender/calendar?${filterParams}`);
  }

  public calendarToggle(
    id: number,
    status?: CalendarTenderStatus,
    calendarDate?: string | null
  ): Observable<any> {
    const payload: {status?: CalendarTenderStatus; calendar_date?: string | null} = {};

    if (status) {
      payload.status = status;
    }

    if (calendarDate !== undefined) {
      payload.calendar_date = calendarDate;
    }

    return this._http.post(`${environment.api}/tender/calendar/${id}`, payload);
  }

  public edital(id: number): Observable<any> {
    return this._http.get(`${environment.api}/tender/get-edital/${id}`);
  }

  public items(id: number): Observable<any> {
    return this._http.get(`${environment.api}/tender/${id}/items`);
  }

  public note(note: Note): Observable<any> {
    return this._http.post(`${environment.api}/tender/note`, note);
  }

  public noteDelete(id: number): Observable<any> {
    return this._http.delete(`${environment.api}/tender/note-delete/${id}`);
  }

  
}
