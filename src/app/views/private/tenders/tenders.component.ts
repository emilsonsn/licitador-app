import {ChangeDetectorRef, Component, HostListener, OnInit, SimpleChanges} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tender} from '@model/tender';
import Estados from '../../../../assets/json/Estados.json';
import Cidades from '../../../../assets/json/Cidades.json';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TenderService} from '@services/tender/tender.service';
import {Order, PageControl} from '@model/application';
import {finalize, take} from "rxjs";
import {FilterService} from '@services/Filter/filter.service';
import {ToastrService} from 'ngx-toastr';
import introJs from 'intro.js';
import { AuthService } from '@services/Auth/auth.service';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent implements OnInit {
  public tenders: Tender[] = [];
  public statesOptions: { value: string, label: string }[] = [];
  public citiesOptions: { value: string, label: string }[] = [];
  public iminenceOptions: { value: string, label: string }[] = [];
  private allCities: any[] = [];
  private selectedStates: Set<string> = new Set();
  public tenderForm!: FormGroup;
  public fill: boolean = false;
  public isAdmin: boolean = false;
  @ViewChild('cardsTop') cardsTop!: ElementRef;

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: 'proposal_closing_date',
    order: Order.DESC,
  };
  isLoading = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private readonly tenderService: TenderService,
    private readonly _filterService: FilterService,
    private readonly _toastrService: ToastrService,
    private cdr: ChangeDetectorRef,
    private readonly _authService: AuthService
  ) {
    this.tenderForm = this.fb.group({
      object: [''],
      uf: [''],
      city: [''],
      publication_date_start: [''],
      update_date_start: [''],
      update_date_end: [''],
      modality_ids: [],
      organ_cnpj: [''],
      organ_name: [''],
      process: [''],
      iminence: [''],
      observations: [''],
      favorite: [false],
      status: [[]],
    });

    this.loadTenders(); // Initial load
  }

  ngOnInit() {
    this.loadStates();
    this.loadCities();
    this.loadRole();
    this.startTour('tenders');

    this.iminenceOptions = [
      {label: 'Sim', value: 'true'},
      {label: 'Não', value: 'false'},
    ]
  }

  loadRole(){
    this._authService.getUser()
    .subscribe( res => {
      this.isAdmin = !!res.data.is_admin;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLoading'] && changes['isLoading'].currentValue) {
      this.loadTenders();
    }
  }

  public getFilter() {
    this._filterService.getFilter()
      .subscribe({
        next: (res) => {
          this.clearFilters();
          setTimeout(() => {
            this.fill = !this.fill;
            this.tenderForm.patchValue(res.data);
            this.onSubmit();
            this.cdr.detectChanges();
          }, 200)
        },
        error: (error) => {
          this._toastrService.error(error.error.message)
        }
      });
  }

  public saveFilter() {
    this._filterService.createFilter(this.tenderForm.getRawValue())
      .subscribe({
        next: (res) => {
          this._toastrService.success(res.message)
        },
        error: (error) => {
          this._toastrService.error(error.error.message)
        }
      });
  }

  pageEvent($event: any) {
    this.pageControl.page = $event.pageIndex + 1;
    this.pageControl.take = $event.pageSize;
    this.onSubmit();
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

  onIminanceChange(iminance: { value: string, label: string }[]) {
    this.tenderForm.get('iminence')?.patchValue(iminance[0]?.value);
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
    this.tenders = [];
    const formValues = this.tenderForm.value;
    // this.pageControl.page = 1;
    // Corrigir valores nulos, undefined ou vazios
    const cleanedFilters = Object.keys(formValues).reduce((acc, key) => {
      const value = formValues[key];
      // Se o valor é nulo, undefined ou uma string vazia, substitua por uma string vazia
      acc[key] = (value === null || value === undefined || value === '') ? '' : value;
      return acc;
    }, {} as any);

    setTimeout(() => {
      this.cardsTop?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }, 0);

    this.isLoading = true;

    this.tenderService.getTenders(this.pageControl, cleanedFilters)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(
      {
        next: (res) => {
          if (res && res.data) {
            this.tenders = res.data.data || [];

            this.pageControl.page = res.data.current_page - 1;
            this.pageControl.itemCount = res.data.total;
            this.pageControl.pageCount = res.data.last_page;      
            
            console.log({
              page2 :this.pageControl.page,
            })

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
    console.log('buscar tender');
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

  // Função para recarregar os tenders com filtros aplicados
  reloadFilters() {
    // Reiniciar a página para garantir que a lista de tenders seja substituída
    this.pageControl.page = 1;

    // Corrigir valores nulos, undefined ou vazios nos filtros
    const formValues = this.tenderForm.value;
    const cleanedFilters = Object.keys(formValues).reduce((acc, key) => {
      const value = formValues[key];
      acc[key] = (value === null || value === undefined || value === '') ? '' : value;
      return acc;
    }, {} as any);

    // Limpar a lista de tenders e recarregar com os filtros aplicados
    this.tenders = [];
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

  public startTour(tour: string, init = false): void {
    let tourString = localStorage.getItem('tour') ?? '[]';
    let storage_tour = JSON.parse(tourString);    
    if(init || !storage_tour.includes(tour)){
        const intro = introJs();
        intro.setOptions({
          steps: [
            {
              intro: `Bem vindo ao buscador de editais!`
            },
            {
              element: 'form',
              intro: "Aqui você encontrará nossos mais diversos filtros de busca.",
              position: 'left'
            },
            {
              element: '#favoritar',
              intro: 'Ao clicar aqui você salva o filtro que está preenchido no formulário abaixo.',
              position: 'left'
            },
            {
              element: '#favorito',
              intro: 'Clicando aqui o filtro salvo é preenchido automáticamente.',
              position: 'left'
            },
            {
              element: '.cards-section',
              intro: 'Esses são os nossos mais de 100.000 editais.',
              position: 'left'
            },
            {
              element: '.cards-section',
              intro: 'Para cada edital você encontrará botões de ação que vai te permitir visitar o site do orgão, ver itens e até baixar editais.',
              position: 'left'
            },
            {
              element: '.cards-section',
              intro: 'Na parte superior de cada você edital você verá um botão onde poderá está favoritando suas licitações de interesse.',
              position: 'left'
            }
          ],
          nextLabel: 'Próximo',
          prevLabel: 'Anterior',
          skipLabel: '×',
          doneLabel: 'Concluir'
        });
        intro.start();
        storage_tour.push(tour)
        localStorage.setItem('tour',JSON.stringify(storage_tour))
    }
}

}
