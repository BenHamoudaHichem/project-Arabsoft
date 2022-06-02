import { Address } from 'src/app/models/Address';
import { QuantityValue } from 'src/app/models/resources/QuantityValue';

export interface IMaterial {
  id: string;
  name: string;
  description: string;
  totalQuantity: QuantityValue;
  dateOfPurchase: string;
  address: Address;
  category: string;
  status: string;
}
