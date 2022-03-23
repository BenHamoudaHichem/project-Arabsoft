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

  public getLocation(): Location {
    return this.location;
  }
  public setLocation(value: Location): void {
    this.location = value;
  }

  public getCity(): string {
    return this.city;
  }
  public setCity(value: string): void {
    this.city = value;
  }

  public getStreet(): string {
    return this.street;
  }
  public setStreet(value: string): void {
    this.street = value;
  }
  public getZipCode(): string {
    return this.zipCode;
  }
  public setZipCode(value: string): void {
    this.zipCode = value;
  }
  public getState(): string {
    return this.state;
  }
  public setState(value: string): void {
    this.state = value;
  }
  public getCountry(): string {
    return this.country;
  }
  public setCountry(value: string): void {
    this.country = value;
  }
}
