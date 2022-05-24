import { Address } from "src/app/models/Address";

export interface IMaterial {
  id: string;
  name: string;
  description: string;
  totalQuantity:number;
  address: Address;
  dateOfPurchase: Date;
  status: string;
}
