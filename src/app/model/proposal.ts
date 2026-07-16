import {BaseEntity} from '@model/application';
import {Company} from '@model/company';
import {Tender} from '@model/tender';

export type ProposalStatus = 'draft' | 'finished' | 'canceled';

export interface ProposalItem extends BaseEntity {
  proposal_id?: number;
  item?: string | null;
  quantity?: number | string | null;
  unit?: string | null;
  specification?: string | null;
  brand?: string | null;
  unit_price?: number | string | null;
  total_value?: number | string | null;
  source_payload?: Record<string, any> | null;
}

export interface Proposal extends BaseEntity {
  user_id?: number;
  company_id?: number;
  tender_id?: number;
  title?: string | null;
  organ_name?: string | null;
  organ_state?: string | null;
  purchase_number?: string | null;
  process_number?: string | null;
  receipt_date?: string | null;
  opening_date?: string | null;
  declarations?: string | null;
  city?: string | null;
  proposal_date?: string | null;
  responsible_name?: string | null;
  responsible_rg?: string | null;
  responsible_cpf?: string | null;
  total_value?: number | string | null;
  status?: ProposalStatus;
  company_snapshot?: Company | null;
  tender_snapshot?: Tender | null;
  company?: Company | null;
  tender?: Tender | null;
  items?: ProposalItem[];
}

export interface ProposalFillResponse {
  company: Company;
  tender: Tender;
  proposal: Proposal;
  items: ProposalItem[];
  warning?: string;
}

export interface ProposalViewResponse {
  proposal: Proposal;
  company: Company;
  tender: Tender;
  items: ProposalItem[];
  declarations?: string | null;
  signature?: {
    responsible_name?: string | null;
    responsible_rg?: string | null;
    responsible_cpf?: string | null;
    city?: string | null;
    proposal_date?: string | null;
  };
}

export interface ProposalStatusOption {
  value: ProposalStatus;
  label: string;
}

export type ProposalTrackingStatus = 'open' | 'finished';
export type ProposalTrackingItemResult = 'pending' | 'won' | 'lost';

export interface ProposalTrackingRanking {
  id?: number;
  position: 1 | 2 | 3;
  company: string;
  brand: string | null;
  price: string;
}

export interface ProposalTrackingItem {
  proposal_item_id: number;
  item?: string | null;
  quantity?: string | number | null;
  unit?: string | null;
  specification?: string | null;
  brand?: string | null;
  unit_price?: string | null;
  total_value?: string | null;
  result: ProposalTrackingItemResult;
  minimum_unit_price?: string | null;
  minimum_total_value?: string | null;
  rankings: ProposalTrackingRanking[];
  classified_at?: string | null;
  classified_by?: number | null;
}

export interface ProposalTrackingResponse {
  proposal: Proposal;
  company: Company;
  tender: Tender;
  tracking: {
    id: number;
    status: ProposalTrackingStatus;
    discount_percentage?: string | null;
    last_updated_by?: number | null;
    finished_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
  items: ProposalTrackingItem[];
  totals: {original: string; minimum: string; won: string};
  won_items: ProposalTrackingItem[];
  declarations?: string | null;
  signature?: ProposalViewResponse['signature'];
  document?: {title: string; generated_at: string; print_css_hint?: string};
}

export interface ProposalCatalogItem {
  id?: number;
  proposal_catalog_id?: number;
  proposal_item_id?: number | null;
  title?: string | null;
  specification?: string | null;
  quantity?: string | number | null;
  unit?: string | null;
  brand?: string | null;
  position: number;
  image_original_name?: string | null;
  image_mime?: string | null;
  image_url?: string | null;
  removed?: boolean;
  pendingImage?: File | null;
  previewUrl?: string | null;
}

export interface ProposalCatalog {
  id: number;
  proposal_id: number;
  user_id: number;
  company_id: number;
  title: string;
  subtitle?: string | null;
  general_notes?: string | null;
  organ_name?: string | null;
  organ_state?: string | null;
  purchase_number?: string | null;
  process_number?: string | null;
  receipt_date?: string | null;
  opening_date?: string | null;
  company_snapshot: Company;
  generated_at?: string | null;
  items: ProposalCatalogItem[];
}

export const PROPOSAL_STATUS_OPTIONS: ProposalStatusOption[] = [
  {value: 'draft', label: 'Rascunho'},
  {value: 'finished', label: 'Finalizada'},
  {value: 'canceled', label: 'Cancelada'},
];
