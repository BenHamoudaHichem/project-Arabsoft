import { Address } from "src/app/models/Address";
import { User } from "src/app/models/user";

export interface IDemand {
  id: string
  title: string
  description: string
  address:Address
  createdAt: Date
  status: string
  user: User
  
}
