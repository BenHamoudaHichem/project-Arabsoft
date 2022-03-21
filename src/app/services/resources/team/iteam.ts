import { User } from 'src/app/models/user';

export interface ITeam {
  id: string;
  members: User[];
}
