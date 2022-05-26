import { Address } from 'src/app/models/Address';
import { QuantityValue } from 'src/app/models/resources/QuantityValue';
import { IMaterial } from './imaterial';

export interface IMaterialUsed extends IMaterial {
  id: string;
  name: string;
  description: string;
  totalQuantity: QuantityValue;
  address: Address;
  dateOfPurchase: Date;
  status: string;
  quantityToUse: QuantityValue;
  dateOfUse: Date;
  category:string

}
