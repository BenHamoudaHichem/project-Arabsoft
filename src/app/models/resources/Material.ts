import { Location } from '../Location';

export class Material {
  constructor(

    private name: string,
    private description: string,
    private location: Location,
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

  public getLocation(): Location {
    return this.location;
  }
  public setLocation(value: Location): void {
    this.location = value;
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
