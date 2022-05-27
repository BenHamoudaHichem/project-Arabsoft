import { Address } from '../Address';
import { QuantityValue } from './QuantityValue';

export class Material {
  constructor(
    protected id: string,
    protected name: string,
    protected description: string,
    protected totalQuantity: QuantityValue,
    protected dateOfPurshase: Date,

    protected address: Address,
    protected category: string,

    protected status: string
  ) {}
 public getId(): string {
    return this.id;
  }
  public setId(value: string) {
    this.id = value;
  }
  public getName(): string {
    return this.name;
  }
  public setName(value: string): void {
    this.name = value;
  }

  public getDescription(): string {
    return this.description;
  }
  public setDescription(value: string): void {
    this.description = value;
  }

  public getaddress(): Address {
    return this.address;
  }
  public setaddress(value: Address): void {
    this.address = value;
  }

  public getDateOfPurshase(): Date {
    return this.dateOfPurshase;
  }
  public setDateOfPurshase(value: Date): void {
    this.dateOfPurshase = value;
  }

  public getStatus(): string {
    return this.status;
  }
  public setStatus(value: string): void {
    this.status = value;
  }
  public getCategory(): string {
    return this.category;
  }
  public setCategory(value: string): void {
    this.category = value;
  }

  public getTotalQuantity(): QuantityValue {
    return this.totalQuantity;
  }
  public setTotalQuantity(value: QuantityValue) {
    this.totalQuantity = value;
  }
}
