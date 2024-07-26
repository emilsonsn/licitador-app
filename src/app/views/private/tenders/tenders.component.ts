import {Component} from '@angular/core';
import {Tender} from "@model/tender";

@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrl: './tenders.component.scss'
})
export class TendersComponent {
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

}
