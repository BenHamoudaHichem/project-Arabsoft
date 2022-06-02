import { Address } from 'src/app/models/Address';
import { QuantityValue } from 'src/app/models/resources/QuantityValue';
import { IMaterial } from './imaterial';

export interface IMaterialUsed extends IMaterial {
  quantityToUse: QuantityValue;
  dateOfUse: Date;

}
