import {BaseEntity} from "@model/application";

export interface User extends BaseEntity {
  name: string;
  email: string;
  email_verified_at: Date | null;
  is_active: number;
  is_admin: boolean;
}
