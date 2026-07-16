import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {PageControl} from '@model/application';
import {Utils} from '@shared/utils';
import {Proposal, ProposalCatalog, ProposalCatalogItem, ProposalStatus, ProposalTrackingItem} from '@model/proposal';

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

  public tracking(id: number): Observable<any> {
    return this._http.get(`${environment.api}/proposal/${id}/tracking`);
  }

  public updateTracking(id: number, payload: {
    discount_percentage?: string | null;
    items?: Partial<ProposalTrackingItem>[];
  }): Observable<any> {
    return this._http.put(`${environment.api}/proposal/${id}/tracking`, payload);
  }

  public applyTrackingDiscount(id: number, discountPercentage: string): Observable<any> {
    return this._http.post(`${environment.api}/proposal/${id}/tracking/apply-discount`, {
      discount_percentage: discountPercentage
    });
  }

  public finishTracking(id: number): Observable<any> {
    return this._http.post(`${environment.api}/proposal/${id}/tracking/finish`, {});
  }

  public reopenTracking(id: number): Observable<any> {
    return this._http.post(`${environment.api}/proposal/${id}/tracking/reopen`, {});
  }

  public printTracking(id: number): Observable<any> {
    return this._http.get(`${environment.api}/proposal/${id}/tracking/print`);
  }

  public exportTracking(id: number): Observable<Blob> {
    return this._http.get(`${environment.api}/proposal/${id}/tracking/export`, {responseType: 'blob'});
  }

  public catalog(proposalId: number): Observable<any> {
    return this._http.get(`${environment.api}/proposal/${proposalId}/catalog`);
  }

  public updateCatalog(proposalId: number, catalog: Partial<ProposalCatalog>): Observable<any> {
    return this._http.put(`${environment.api}/proposal/${proposalId}/catalog`, catalog);
  }

  public uploadCatalogImage(proposalId: number, itemId: number, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    return this._http.post(`${environment.api}/proposal/${proposalId}/catalog/items/${itemId}/image`, formData);
  }

  public deleteCatalogImage(proposalId: number, itemId: number): Observable<any> {
    return this._http.delete(`${environment.api}/proposal/${proposalId}/catalog/items/${itemId}/image`);
  }

  public generateCatalog(proposalId: number): Observable<any> {
    return this._http.post(`${environment.api}/proposal/${proposalId}/catalog/generate`, {});
  }

  public viewCatalog(catalogId: number): Observable<any> {
    return this._http.get(`${environment.api}/proposal-catalog/${catalogId}/view`);
  }
}
