import { Address } from "../Address";
import { Material } from "./Material";

export class MaterialUsed extends Material {
  constructor(name: string,
    description: string,
   totalQuantity:number,

    address: Address,
    dateOfPurshase: Date,
    status: string,
    private quantityToUse: number,
    private measure: string,
    private dateOfUse: Date) {
    super(name,
      description,
      totalQuantity,
      address,
      dateOfPurshase,
      status);
  }

  public getquantityToUse(): number {
    return this.quantityToUse;
  }
  public setquantityToUse(value: number): void {
    this.quantityToUse = value;
  }
  public setMeasure(value: string): void {
    this.measure = value;
  }

  public getMeasure(): string {
    return this.measure;
  }
  public setdateOfUse(value: Date): void {
    this.dateOfUse = value;
  }

  public getdateOfUse(): Date {
    return this.dateOfUse;
  }

}
