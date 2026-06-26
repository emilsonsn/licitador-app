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

export const PROPOSAL_STATUS_OPTIONS: ProposalStatusOption[] = [
  {value: 'draft', label: 'Rascunho'},
  {value: 'finished', label: 'Finalizada'},
  {value: 'canceled', label: 'Cancelada'},
];
