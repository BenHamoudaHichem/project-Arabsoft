import { Address } from "src/app/models/Address";

export interface IDemand {
  id: string;
  title: string;
  description: string;
  address:Address
  createdAt: Date;
  status: string;
  user: string;
}
