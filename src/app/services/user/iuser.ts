import { Address } from 'src/app/models/Address';

export interface IUser {
  id: string;
  firstName: string;
  lastNamme: string;
  password: string;
  identifier: string;
  tel: string;
  adresse: Address;
}
