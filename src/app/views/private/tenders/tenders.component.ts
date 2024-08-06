import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tender} from "@model/tender";
import Estados from '../../../../assets/json/Estados.json';
import Cidades from '../../../../assets/json/Cidades.json';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent implements OnInit {
  public tenders: Tender[] = [
    {
      id: 1,
      Objective: 'Construção de Escola',
      Datas: '2024-08-01',
      Edital: 'Edital Nº 001/2024',
      Orgao: 'Secretaria de Educação',
      Cidade: 'São Paulo',
      Status: 'Aberto',
      N_Conlicitacao: 'CON-2024-001',
      created_at: new Date('2024-07-01T10:00:00Z'),
      updated_at: new Date('2024-07-10T15:30:00Z'),
    },
    {
      id: 2,
      Objective: 'Reforma de Hospital',
      Datas: '2024-09-15',
      Edital: 'Edital Nº 002/2024',
      Orgao: 'Secretaria de Saúde',
      Cidade: 'Rio de Janeiro',
      Status: 'Fechado',
      N_Conlicitacao: 'CON-2024-002',
      created_at: new Date('2024-07-05T09:00:00Z'),
      updated_at: new Date('2024-07-20T11:00:00Z'),
    },
    {
      id: 3,
      Objective: 'Manutenção de Rodovias',
      Datas: '2024-08-20',
      Edital: 'Edital Nº 003/2024',
      Orgao: 'Departamento de Estradas',
      Cidade: 'Belo Horizonte',
      Status: 'Aberto',
      N_Conlicitacao: 'CON-2024-003',
      created_at: new Date('2024-07-08T14:00:00Z'),
      updated_at: new Date('2024-07-15T12:00:00Z'),
    },
    {
      id: 4,
      Objective: 'Aquisição de Equipamentos',
      Datas: '2024-10-10',
      Edital: 'Edital Nº 004/2024',
      Orgao: 'Secretaria de Tecnologia',
      Cidade: 'Porto Alegre',
      Status: 'Em Análise',
      N_Conlicitacao: 'CON-2024-004',
      created_at: new Date('2024-07-12T16:00:00Z'),
      updated_at: new Date('2024-07-22T13:00:00Z'),
    },
    {
      id: 5,
      Objective: 'Serviços de Limpeza Urbana',
      Datas: '2024-11-05',
      Edital: 'Edital Nº 005/2024',
      Orgao: 'Prefeitura Municipal',
      Cidade: 'Curitiba',
      Status: 'Aberto',
      N_Conlicitacao: 'CON-2024-005',
      created_at: new Date('2024-07-18T08:00:00Z'),
      updated_at: new Date('2024-07-25T10:00:00Z'),
    },
    {
      id: 6,
      Objective: 'Fornecimento de Material Escolar',
      Datas: '2024-12-01',
      Edital: 'Edital Nº 006/2024',
      Orgao: 'Secretaria de Educação',
      Cidade: 'Salvador',
      Status: 'Fechado',
      N_Conlicitacao: 'CON-2024-006',
      created_at: new Date('2024-07-20T11:00:00Z'),
      updated_at: new Date('2024-07-25T14:00:00Z'),
    }
  ];
  public statesOptions: { value: string, label: string }[] = [];
  public citiesOptions: { value: string, label: string }[] = [];
  private allCities: any[] = [];
  private selectedStates: Set<string> = new Set();

  public tenderForm!: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {
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


      /*
            proposal_closing_date_start: [''],
            proposal_closing_date_end: [''],
            publication_date_end: [''],
            */
    });
  }

  ngOnInit() {
    this.loadStates();
    this.loadCities();
  }

  loadStates() {
    this.statesOptions = Estados.map(state => ({
      value: state.ID,
      label: state.Nome
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
    this.loadCities(); // Reload city data and apply filters
  }

  onSubmit() {
    console.log(this.tenderForm.value);
  }
}
