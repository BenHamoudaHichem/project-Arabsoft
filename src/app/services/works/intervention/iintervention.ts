import { Address } from 'src/app/models/Address';
import { Category } from 'src/app/models/Category';
import { Material } from 'src/app/models/resources/Material';
import { Team } from 'src/app/models/resources/team';
import { Demand } from 'src/app/models/works/demand';
import { IMaterial } from '../../resources/material/imaterial';
import { ITeam } from '../../resources/team/iteam';
import { IDemand } from '../demand/idemand';

export interface IIntervention {
  id: string;
    title: string,
    description: string,
    category: Category,
    address:Address,
    startedAt: Date,
    status: string,
    demandList:IDemand[],
    team:ITeam,
    createdAt: Date,
    materials:IMaterial[]
}
