import { Address } from 'src/app/models/Address';
import { Category } from 'src/app/models/Category';
import { MaterialUsed } from 'src/app/models/resources/MaterialUsed';
import { IMaterial } from '../../resources/material/imaterial';
import { IMaterialUsed } from '../../resources/material/imterialUsed';
import { ITeam } from '../../resources/team/iteam';
import { IDemand } from '../demand/idemand';
import { IIntervention } from './iintervention';

export interface IInterventionClosed extends IIntervention {
  id: string;
  title: string;
  description: string;
  category: Category;
  address: Address;
  startedAt: Date;
  expiredAt: Date;
  status: string;
  demandList: IDemand[];
  team: ITeam;
  createdAt: Date;
  materialsToBeUsed: MaterialUsed[];
  closingComment: string;
  closedDate: Date;
  materialUsedList:MaterialUsed[]
  workingGroup: ITeam;
}
