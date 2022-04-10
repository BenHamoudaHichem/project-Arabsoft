import { Address } from 'src/app/models/Address';
import { Category } from 'src/app/models/Category';
import { Material } from 'src/app/models/resources/Material';
import { Team } from 'src/app/models/resources/team';
import { ITeam } from '../../resources/team/iteam';

export interface IIntervention {
  id: string;
    title: string,
    description: string,
    category: Category,
    address:Address,
    startedAt: Date,
    status: string,
    demandList:{id:string}[],
    team:ITeam,
    createdAt: Date,
    materialList:Material[]
}
