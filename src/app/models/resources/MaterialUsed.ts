import { Address } from '../Address';
import { Material } from './Material';
import { QuantityValue } from './QuantityValue';

export class MaterialUsed extends Material {
  constructor(
    id: string,
    name: string,
    description: string,
    totalQuantity: QuantityValue,
    dateOfPurshase: Date,

    address: Address,
    category: string,
    status: string,

    private quantityToUse: QuantityValue,
    private dateOfUse: Date
  ) {
    super(
      id,
      name,
      description,
      totalQuantity,

      dateOfPurshase,
      address,
      category,
      status
    );
  }

  public getquantityToUse(): QuantityValue {
    return this.quantityToUse;
  }
  public setquantityToUse(value: QuantityValue): void {
    this.quantityToUse = value;
  }

  public setdateOfUse(value: Date): void {
    this.dateOfUse = value;
  }

  public getdateOfUse(): Date {
    return this.dateOfUse;
  }
}
