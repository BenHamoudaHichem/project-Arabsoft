import { User } from 'src/app/models/user';

export interface ITeam {
  id: string;
name: string;
  manager: User;
  members: User[];
}
