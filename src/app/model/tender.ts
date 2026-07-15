export interface Tender {
  id: number;
  value: string;
  modality: string;
  modality_id: number;
  status: string;
  year_purchase: number;
  number_purchase: string;
  organ_cnpj: string;
  organ_name: string;
  uf: string;
  city: string;
  city_code: string;
  description: string;
  object: string;
  instrument_name: string;
  observations: string | null;
  origin_url: string | null;
  process: string;
  bid_opening_date: string;
  proposal_closing_date: string;
  publication_date: string;
  update_date: string;
  favorites: any;
  api_origin: string;
  items: TenderItem[];
  notes: Note[];
  calendar_status?: CalendarTenderStatus | null;
  calendar_date?: string | null;
  calendarTenders?: CalendarTender[];
}

export interface TenderItem {
  numeroItem: number | null;
  descricao: string;
  materialOuServico: string;
  materialOuServicoNome: string;
  valorUnitarioEstimado: number;
  valorTotal: number;
  quantidade: number;
  unidadeMedida: string;
  orcamentoSigiloso: boolean;
  itemCategoriaId: number;
  itemCategoriaNome: string;
}

export interface Note{
  id?: number;
  tender_id: number;
  tender?: Tender;
  note: string;
}

export type CalendarTenderStatus =
  'participating'
  | 'qualification'
  | 'won'
  | 'to_receive'
  | 'finished'
  | 'disqualified'
  | 'not_done'
  | 'no_award'
  | 'suspended_new_date';

export interface CalendarTender {
  tender_id: number;
  user_id: number;
  status: CalendarTenderStatus;
  calendar_date?: string | null;
}

export interface CalendarStatusOption {
  value: CalendarTenderStatus;
  label: string;
  className: string;
}

export const CALENDAR_STATUS_OPTIONS: CalendarStatusOption[] = [
  {value: 'participating', label: 'Participando', className: 'status-participating'},
  {value: 'qualification', label: 'Habilitação', className: 'status-qualification'},
  {value: 'won', label: 'Ganha', className: 'status-won'},
  {value: 'to_receive', label: 'A receber', className: 'status-to-receive'},
  {value: 'finished', label: 'Finalizado', className: 'status-finished'},
  {value: 'disqualified', label: 'Desclassificado', className: 'status-disqualified'},
  {value: 'not_done', label: 'Não fez', className: 'status-not-done'},
  {value: 'no_award', label: 'Não ganhou nada', className: 'status-no-award'},
  {value: 'suspended_new_date', label: 'Suspenso/Nova data', className: 'status-suspended-new-date'},
];
