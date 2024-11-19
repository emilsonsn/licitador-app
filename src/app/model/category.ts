import {BaseEntity} from "@model/application";

export interface Category extends BaseEntity {
  id?: number;
  description: string;
}
