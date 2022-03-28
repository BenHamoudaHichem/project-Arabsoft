import { Address } from "src/app/models/Address";

export interface IMaterial {
  id: string;
  name: string;
  description: string;
  address: Address;
  dateOfPurshase: Date;
  status: string;
}
