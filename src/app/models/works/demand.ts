import { Address } from "../Address";

export class Demand {
  constructor(

    private title: string,
    private description: string,
    private address: Address,
    private createdAt: Date,
    private status: string,
    private user: {id:string},

  ) {}



  public getTitle(): string {
    return this.title;
  }
  public setTitle(value: string): void {
    this.title = value;
  }

  public getDescription(): string {
    return this.description;
  }
  public setDescription(value: string): void {
    this.description = value;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }
  public setCreatedAt(value: Date): void {
    this.createdAt = value;
  }

  public getStatus(): string {
    return this.status;
  }
  public setStatus(value: string): void {
    this.status = value;
  }

  public getUser(): {id:string} {
    return this.user;
  }
  public setUser(value: {id:string}): void {
    this.user = value;
  }
  public getLocation(): Address {
    return this.address;
  }
  public setLocation(value: Address): void {
    this.address = value;
  }
}
