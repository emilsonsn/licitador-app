import {Component, HostListener} from '@angular/core';
import {Tender} from "@model/tender";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Order, PageControl} from "@model/application";
import {HttpClient} from "@angular/common/http";
import {TenderService} from "@services/tender/tender.service";
import Estados from "../../../../assets/json/Estados.json";
import Cidades from "../../../../assets/json/Cidades.json";
import {take} from "rxjs";

@Component({
  selector: 'app-tenders-favorites',
  templateUrl: './tenders-favorites.component.html',
  styleUrl: './tenders-favorites.component.scss'
})
export class TendersFavoritesComponent {
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
    private fb: FormBuilder,
    private readonly tenderService: TenderService
  ) {
    this.tenderForm = this.fb.group({
      favorite: ['true'],
    });

    this.onSubmit(); // Initial load
  }

  pageEvent($event: any) {
    this.pageControl.page = $event.pageIndex + 1;
    this.pageControl.take = $event.pageSize;
    this.onSubmit();
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

    // console.log(this.isLoading)

    if (!this.isLoading && (scrollTop + clientHeight >= scrollHeight - 10)) {
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

  onSubmit() {
    const formValues = this.tenderForm.value;
    // this.pageControl.page = 1;
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

            this.pageControl.page = res.data.current_page - 1;
            this.pageControl.itemCount = res.data.total;
            this.pageControl.pageCount = res.data.last_page;

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
    this.tenderService.getTenders(this.pageControl, {})
      .pipe(take(1))
      .subscribe(
        {
          next: (res) => {
            if (res && res.data) {
              // Filtrar duplicatas com base no ID do tender
              const newTenders = res.data.data || [];
              const existingTenderIds = new Set(this.tenders.map(tender => tender.id));
              const uniqueTenders = newTenders.filter((tender: { id: number; }) => !existingTenderIds.has(tender.id));

              this.pageControl.page = res.data.current_page - 1;
              this.pageControl.itemCount = res.data.total;
              this.pageControl.pageCount = res.data.last_page;

              // Adicionar tenders únicos à lista existente
              this.tenders = [...this.tenders, ...uniqueTenders];
              /* if (!!this.pageControl.page) {
                 this.pageControl.page += 1;
               }*/
            }
          },
          error: (error) => {
            console.error('Error loading tenders', error);
            this.isLoading = false;
          }
        }
      );
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  loadMoreTenders() {
    this.loadTenders();
  }

  clearFilters() {
    // Limpar os valores dos filtros no formulário
    this.tenderForm.reset();

    // Limpar a lista de cidades
    this.selectedStates.clear();
    this.filterCities();

    // Limpar a lista de tenders e reiniciar a página para recarregar os tenders
    this.tenders = [];
    this.pageControl.page = 1;
    this.loadTenders();
  }


}
