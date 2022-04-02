import { Category } from 'src/app/models/Category';
import { Material } from 'src/app/models/resources/Material';

export interface IIntervention {
  id: string;
    title: string,
    description: string,
    category: Category,
    startedAt: Date,
    status: string,
    demandList:{id:string}[],
    team:string,
    createdAt: Date,
    materials:Material[]
}
