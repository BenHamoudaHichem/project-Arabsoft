import { Location } from "./Location";

export class Address {
  constructor(

    private city: string,
    private country: string,
    private state: string,
    private location:Location
  ) {}

  public getCity(): string {
    return this.city;
  }
  public setCity(value: string): void {
    this.city = value;
  }
  public getLocation(): Location {
    return this.location;
  }
  public setLocation(value: Location): void {
    this.location = value;
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
