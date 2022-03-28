import { Address } from '../Address';


export class Material {
  constructor(

    private name: string,
    private description: string,
    private address: Address,
    private dateOfPurshase: Date,
    private status: string
  ) {}


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
}
