import { Address } from 'src/app/models/Address';
import { Category } from 'src/app/models/Category';
import { Material } from 'src/app/models/resources/Material';
import { Team } from 'src/app/models/resources/team';

export interface IIntervention {
  id: string;
    title: string,
    description: string,
    category: Category,
    address:Address,
    startedAt: Date,
    status: string,
    demandList:{id:string}[],
    team:Team,
    createdAt: Date,
    materials:Material[]
}
