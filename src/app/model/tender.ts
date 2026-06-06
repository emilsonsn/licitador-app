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
