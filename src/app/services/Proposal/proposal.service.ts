import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {PageControl} from '@model/application';
import {Utils} from '@shared/utils';
import {Proposal, ProposalStatus} from '@model/proposal';

export interface ProposalFilters {
  search?: string;
  tender_id?: number | string;
  company_id?: number | string;
  status?: ProposalStatus | '';
}

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  constructor(private readonly _http: HttpClient) {}

  public search(pageControl: PageControl, filters?: ProposalFilters): Observable<any> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters as any);

    return this._http.get(`${environment.api}/proposal?${paginate}${filterParams}`);
  }

  public get(id: number): Observable<any> {
    return this._http.get(`${environment.api}/proposal/${id}`);
  }

  public fill(tenderId: number | string): Observable<any> {
    return this._http.post(`${environment.api}/proposal/fill`, {tender_id: tenderId});
  }

  public create(proposal: Partial<Proposal>): Observable<any> {
    return this._http.post(`${environment.api}/proposal`, proposal);
  }

  public update(id: number, proposal: Partial<Proposal>): Observable<any> {
    return this._http.patch(`${environment.api}/proposal/${id}`, proposal);
  }

  public delete(id: number): Observable<any> {
    return this._http.delete(`${environment.api}/proposal/${id}`);
  }

  public view(id: number): Observable<any> {
    return this._http.get(`${environment.api}/proposal/${id}/view`);
  }
}
