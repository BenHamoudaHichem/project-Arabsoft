import { Address } from 'src/app/models/Address';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  identifier: string;
  password: string;
  address: Address;
  tel: string;
  role: string[];
}
