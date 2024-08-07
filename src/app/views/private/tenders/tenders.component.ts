import {Component, HostListener, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tender} from '@model/tender';
import Estados from '../../../../assets/json/Estados.json';
import Cidades from '../../../../assets/json/Cidades.json';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TenderService} from '@services/tender/tender.service';
import {Order, PageControl} from '@model/application';

@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent implements OnInit {
  public tenders: Tender[] = [];
  public statesOptions: { value: string, label: string }[] = [];
  public citiesOptions: { value: string, label: string }[] = [];
  private allCities: any[] = [];
  private selectedStates: Set<string> = new Set();
  public tenderForm!: FormGroup;
  pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: '',
    order: Order.ASC,
  };
  isLoading = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private readonly tenderService: TenderService
  ) {
    this.tenderForm = this.fb.group({
      object: [''],
      uf: [],
      city: [],
      publication_date_start: [''],
      update_date_start: [''],
      update_date_end: [''],
      modality_ids: [],
      organ_cnpj: [''],
      organ_name: [''],
      process: [''],
      observations: [''],
      favorite: [false],
      status: [[]],
    });

    this.loadTenders(); // Initial load
  }

  ngOnInit() {
    this.loadStates();
    this.loadCities();
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;

    /*    console.log('ScrollTop:', scrollTop);
        console.log('ScrollHeight:', scrollHeight);
        console.log('ClientHeight:', clientHeight);
        console.log(scrollTop + clientHeight >= scrollHeight - 10);*/

    if (this.isLoading && (scrollTop + clientHeight >= scrollHeight - 10)) {
      console.log('Trigger load more');
      this.loadMoreTenders();
    }
  }


  loadStates() {
    this.statesOptions = Estados.map(state => ({
      value: state.ID,
      label: state.Nome,
      sigla: state.Sigla
    }));
  }

  loadCities() {
    this.allCities = Cidades;
    this.filterCities(); // Initial filter to load all cities
  }

  onStatesChange(selectedStates: { value: string, label: string }[]) {
    this.selectedStates = new Set(selectedStates.map(state => state.value));
    this.filterCities();
  }

  selectAllStates() {
    this.selectedStates.clear();
    this.filterCities();
  }

  filterCities() {
    if (this.selectedStates.size === 0) {
      this.citiesOptions = this.allCities.map(city => ({
        value: city.ID,
        label: city.Nome
      }));
    } else {
      const filteredCities = this.allCities.filter(city => this.selectedStates.has(city.Estado));
      this.citiesOptions = filteredCities.map(city => ({
        value: city.ID,
        label: city.Nome
      }));
    }
  }

  clearFilters() {
    this.selectedStates.clear();
    this.filterCities();
  }

  reloadFilters() {
    this.loadCities();
  }

  onSubmit() {
    const formValues = this.tenderForm.value;
    this.pageControl.page = 1;
    // Corrigir valores nulos, undefined ou vazios
    const cleanedFilters = Object.keys(formValues).reduce((acc, key) => {
      const value = formValues[key];
      // Se o valor é nulo, undefined ou uma string vazia, substitua por uma string vazia
      acc[key] = (value === null || value === undefined || value === '') ? '' : value;
      return acc;
    }, {} as any);

    this.tenderService.getTenders(this.pageControl, cleanedFilters).subscribe(
      {
        next: (res) => {
          if (res && res.data) {
            this.tenders = res.data.data || [];
          } else {
            this.tenders = [];
          }
        },
        error: (error) => {
          console.error('Error fetching tenders', error);
          this.tenders = [];
        }
      }
    );
  }


  loadTenders() {
    this.isLoading = true;
    this.tenderService.getTenders(this.pageControl, {}).subscribe(
      {
        next: (res) => {
          if (res && res.data) {
            this.tenders = [...this.tenders, ...res.data.data];
            if (!!this.pageControl.page) {
              this.pageControl.page += 1;
            }
          }
        },
        error: (error) => {
          console.error('Error loading tenders', error);
          this.isLoading = false;
        }
      }
    );
  }

  loadMoreTenders() {
    this.loadTenders();
  }
}
