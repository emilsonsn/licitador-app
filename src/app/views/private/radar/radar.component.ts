import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {FormBuilder, FormGroup} from '@angular/forms';
import Estados from '../../../../assets/json/Estados.json';
import Cidades from '../../../../assets/json/Cidades.json';
import MunicipiosCoordenadas from '../../../../assets/json/MunicipiosCoordenadas.json';
import {Tender} from '@model/tender';
import {Order, PageControl} from '@model/application';
import {TenderService} from '@services/tender/tender.service';
import {ToastrService} from 'ngx-toastr';

interface StateOption {
  value: string;
  label: string;
  sigla: string;
}

interface CityOption {
  value: string;
  label: string;
  stateId: string;
}

interface MunicipalityCoordinate {
  codigo_ibge: number;
  nome: string;
  latitude: number;
  longitude: number;
  codigo_uf: number;
}

const UF_CODES: Record<string, number> = {
  AC: 12,
  AL: 27,
  AM: 13,
  AP: 16,
  BA: 29,
  CE: 23,
  DF: 53,
  ES: 32,
  GO: 52,
  MA: 21,
  MG: 31,
  MS: 50,
  MT: 51,
  PA: 15,
  PB: 25,
  PE: 26,
  PI: 22,
  PR: 41,
  RJ: 33,
  RN: 24,
  RO: 11,
  RR: 14,
  RS: 43,
  SC: 42,
  SE: 28,
  SP: 35,
  TO: 17,
};

interface RadarGroup {
  cityCode: string;
  city: string;
  uf: string;
  lat: number;
  lng: number;
  distance: number | null;
  tenders: Tender[];
}

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss']
})
export class RadarComponent implements OnInit, AfterViewInit, OnDestroy {
  public radarForm: FormGroup;
  public statesOptions: StateOption[] = [];
  public citiesOptions: CityOption[] = [];
  public modalityOptions = [
    {value: '', label: 'Todas'},
    {value: '5', label: 'Pregão eletrônico'},
    {value: '6', label: 'Dispensas e dispensas eletrônicas'},
    {value: '1', label: 'Convite'},
    {value: '2', label: 'Concorrência'},
    {value: '3', label: 'Leilão'},
    {value: '4', label: 'Tomada de preços'},
    {value: '8', label: 'Pregão presencial'},
    {value: '9,10,11,12', label: 'Outros'},
  ];
  public radiusKm = 660;
  public isLoading = false;
  public groups: RadarGroup[] = [];
  public selectedGroup: RadarGroup | null = null;
  public totalTenders = 0;
  public visibleTenders = 0;

  private readonly isBrowser: boolean;
  private allCities: CityOption[] = [];
  private coordinateByCityCode = new Map<string, MunicipalityCoordinate>();
  private coordinateByCityAndUf = new Map<string, MunicipalityCoordinate>();
  private map: any;
  private markerLayer: any;
  private radiusLayer: any;
  private L: any;
  private readonly pageControl: PageControl = {
    take: 500,
    page: 1,
    orderField: 'proposal_closing_date',
    order: Order.ASC,
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly tenderService: TenderService,
    private readonly _toastrService: ToastrService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.radarForm = this.fb.group({
      object: [''],
      modality_ids: [''],
      uf: [''],
      city: [''],
    });
  }

  ngOnInit(): void {
    this.mountCoordinateIndex();
    this.mountOptions();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  onStateChange(): void {
    const selectedUf = this.radarForm.get('uf')?.value;
    const selectedState = this.statesOptions.find((state) => state.sigla === selectedUf);

    this.radarForm.patchValue({city: ''});

    this.citiesOptions = selectedState
      ? this.allCities.filter((city) => city.stateId === selectedState.value)
      : this.allCities;
  }

  onSearch(): void {
    this.selectedGroup = null;
    this.isLoading = true;

    const filters = this.cleanFilters(this.radarForm.value);

    this.tenderService.getTenders(this.pageControl, filters).subscribe({
      next: (res) => {
        const tenders = res?.data?.data ?? [];
        this.totalTenders = res?.data?.total ?? tenders.length;
        this.groups = this.groupTendersByCity(tenders);
        this.visibleTenders = this.groups.reduce((sum, group) => sum + group.tenders.length, 0);
        this.renderMap();

        if (!this.groups.length) {
          this._toastrService.info('Nenhuma licitação encontrada para os filtros informados.');
        }
      },
      error: () => {
        this.groups = [];
        this.visibleTenders = 0;
        this.renderMap();
        this._toastrService.error('Não foi possível carregar as licitações do radar.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  clearFilters(): void {
    this.radarForm.reset({
      object: '',
      modality_ids: '',
      uf: '',
      city: '',
    });
    this.radiusKm = 660;
    this.citiesOptions = this.allCities;
    this.selectedGroup = null;
    this.groups = [];
    this.visibleTenders = 0;
    this.totalTenders = 0;
    this.renderMap();
  }

  openTender(tender: Tender): void {
    if (!tender.origin_url) {
      this._toastrService.warning('Site de origem não encontrado.');
      return;
    }

    window.open(this.formatUrl(tender.origin_url), '_blank');
  }

  formatCurrency(value: string | null | undefined): string {
    if (!value || value === '0.00') {
      return 'Sigiloso';
    }

    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  private async initMap(): Promise<void> {
    this.L = await import('leaflet');

    this.map = this.L.map('radar-map', {
      zoomControl: true,
      attributionControl: true
    }).setView([-14.235, -51.9253], 4);

    this.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(this.map);

    this.markerLayer = this.L.layerGroup().addTo(this.map);
    this.onSearch();
  }

  private renderMap(): void {
    if (!this.map || !this.L || !this.markerLayer) {
      return;
    }

    this.markerLayer.clearLayers();

    if (this.radiusLayer) {
      this.radiusLayer.remove();
      this.radiusLayer = null;
    }

    const center = this.getSelectedCenter();

    if (center) {
      this.radiusLayer = this.L.circle([center.lat, center.lng], {
        radius: this.radiusKm * 1000,
        color: '#24dff2',
        fillColor: '#24dff2',
        fillOpacity: 0.08,
        weight: 2,
        dashArray: '8 8'
      }).addTo(this.map);
    }

    const bounds: any[] = [];

    this.groups.forEach((group) => {
      const size = Math.min(48, 30 + group.tenders.length * 2);
      const marker = this.L.marker([group.lat, group.lng], {
        icon: this.L.divIcon({
          className: 'radar-marker',
          html: `<span>${group.tenders.length}</span>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2]
        })
      });

      marker.bindTooltip(`
        <strong>${group.city}/${group.uf}</strong><br>
        ${group.tenders.length} licitação${group.tenders.length > 1 ? 'ões' : ''}<br>
        ${group.distance !== null ? `${group.distance.toFixed(1)} km do centro<br>` : ''}
        <small>Clique para ver as licitações</small>
      `);

      marker.on('click', () => {
        this.selectedGroup = group;
      });

      marker.addTo(this.markerLayer);
      bounds.push([group.lat, group.lng]);
    });

    if (center) {
      bounds.push([center.lat, center.lng]);
      this.map.setView([center.lat, center.lng], this.radiusKm > 900 ? 6 : 7);
      return;
    }

    if (bounds.length) {
      this.map.fitBounds(bounds, {padding: [24, 24]});
    } else {
      this.map.setView([-14.235, -51.9253], 4);
    }
  }

  private groupTendersByCity(tenders: Tender[]): RadarGroup[] {
    const center = this.getSelectedCenter();
    const grouped = new Map<string, RadarGroup>();

    tenders.forEach((tender) => {
      const coordinate = this.coordinateByCityCode.get(String(tender.city_code));

      if (!coordinate) {
        return;
      }

      const distance = center ? this.distanceKm(center.lat, center.lng, coordinate.latitude, coordinate.longitude) : null;

      if (center && distance !== null && distance > this.radiusKm) {
        return;
      }

      const key = String(tender.city_code || `${tender.city}-${tender.uf}`);
      const current = grouped.get(key);

      if (current) {
        current.tenders.push(tender);
        return;
      }

      grouped.set(key, {
        cityCode: key,
        city: tender.city || coordinate.nome,
        uf: tender.uf,
        lat: coordinate.latitude,
        lng: coordinate.longitude,
        distance,
        tenders: [tender]
      });
    });

    return Array.from(grouped.values()).sort((a, b) => {
      if (a.distance === null && b.distance === null) {
        return b.tenders.length - a.tenders.length;
      }

      return (a.distance ?? 0) - (b.distance ?? 0);
    });
  }

  private getSelectedCenter(): { lat: number; lng: number } | null {
    const selectedCity = this.radarForm.get('city')?.value;
    const selectedUf = this.radarForm.get('uf')?.value;

    if (selectedCity) {
      const city = this.allCities.find((option) => {
        const state = this.statesOptions.find((item) => item.value === option.stateId);

        return option.label === selectedCity && (!selectedUf || state?.sigla === selectedUf);
      });
      const coordinate = city ? this.coordinateByCityCode.get(city.value) : null;

      return coordinate ? {lat: coordinate.latitude, lng: coordinate.longitude} : null;
    }

    if (selectedUf) {
      const stateCenter = this.getStateCenter(selectedUf);
      return stateCenter;
    }

    return null;
  }

  private getStateCenter(uf: string): { lat: number; lng: number } | null {
    const selectedState = this.statesOptions.find((state) => state.sigla === uf);

    if (!selectedState) {
      return null;
    }

    const stateCities = this.allCities
      .filter((city) => city.stateId === selectedState.value)
      .map((city) => this.coordinateByCityCode.get(city.value))
      .filter((coordinate): coordinate is MunicipalityCoordinate => !!coordinate);

    if (!stateCities.length) {
      return null;
    }

    const sum = stateCities.reduce((acc, coordinate) => ({
      lat: acc.lat + coordinate.latitude,
      lng: acc.lng + coordinate.longitude
    }), {lat: 0, lng: 0});

    return {
      lat: sum.lat / stateCities.length,
      lng: sum.lng / stateCities.length
    };
  }

  private cleanFilters(formValues: any): any {
    return {
      object: formValues.object ?? '',
      modality_ids: formValues.modality_ids ?? '',
      uf: formValues.uf ?? '',
      city: formValues.city ?? '',
    };
  }

  private mountOptions(): void {
    this.statesOptions = Estados.map((state: any) => ({
      value: state.ID,
      label: state.Nome,
      sigla: state.Sigla
    }));

    this.allCities = Cidades.map((city: any) => {
      const state = this.statesOptions.find((item) => item.value === city.Estado);
      const coordinate = state
        ? this.coordinateByCityAndUf.get(`${city.Nome}-${UF_CODES[state.sigla]}`)
        : null;

      return {
        value: coordinate ? String(coordinate.codigo_ibge) : city.ID,
        label: city.Nome,
        stateId: city.Estado
      };
    });

    this.citiesOptions = this.allCities;
  }

  private mountCoordinateIndex(): void {
    (MunicipiosCoordenadas as MunicipalityCoordinate[]).forEach((municipality) => {
      this.coordinateByCityCode.set(String(municipality.codigo_ibge), municipality);
      this.coordinateByCityAndUf.set(`${municipality.nome}-${municipality.codigo_uf}`, municipality);
    });
  }

  private distanceKm(originLat: number, originLng: number, targetLat: number, targetLng: number): number {
    const earthRadiusKm = 6371;
    const dLat = this.toRadians(targetLat - originLat);
    const dLng = this.toRadians(targetLng - originLng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(originLat)) *
      Math.cos(this.toRadians(targetLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRadians(value: number): number {
    return value * Math.PI / 180;
  }

  private formatUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }

    return url;
  }
}
