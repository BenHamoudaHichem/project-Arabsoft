import { Category } from 'src/app/models/Category';
import { Material } from 'src/app/models/resources/Material';

export interface IIntervention {
  id: string;
  title: string;
  description: string;
  category: Category;
  status:string,
  createdAt: Date;
  startedAt: Date;
  materials:Material[]
}
