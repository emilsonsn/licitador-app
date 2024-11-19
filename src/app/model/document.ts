import {BaseEntity} from "@model/application";
import { Category } from "./category";

export interface Document extends BaseEntity {
  id?: number;
  description: string;
  filename: string;
  path: string;
  expiration_date: Date;
  category?: Category;
}
