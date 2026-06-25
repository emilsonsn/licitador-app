import {BaseEntity} from "@model/application";

export interface Company extends BaseEntity {
  user_id?: number;
  cnpj?: string | null;
  corporate_reason?: string | null;
  fantasy_name?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zipcode?: string | null;
  phone?: string | null;
  email?: string | null;
  legal_representative_name?: string | null;
  legal_representative_rg?: string | null;
  legal_representative_cpf?: string | null;
  bank?: string | null;
  agency?: string | null;
  checking_account?: string | null;
  logo?: string | null;
}
