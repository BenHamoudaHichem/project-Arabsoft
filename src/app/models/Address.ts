import { Location } from "./Location";

export class Address {
  constructor(
    private zipCode: string,
    private street: string,
    private city:string,
    private state: string,
    private country: string,
    private location:Location
  ) {}

  public  Location(): Location {
    return this.location;
  }
  public setLocation(value: Location): void {
    this.location = value;
  }

  public get City(): string {
    return this.city;
  }
  public set City(value: string) {
    this.city = value;
  }

  public get Street(): string {
    return this.street;
  }
  public set Street(value: string) {
    this.street = value;
  }
  public get ZipCode(): string {
    return this.zipCode;
  }
  public set ZipCode(value: string) {
    this.zipCode = value;
  }
  public get State(): string {
    return this.state;
  }
  public set State(value: string) {
    this.state = value;
  }
  public get Country(): string {
    return this.country;
  }
  public set Country(value: string) {
    this.country = value;
  }
  public get toString(): string {
    return this.country;
  }


}
