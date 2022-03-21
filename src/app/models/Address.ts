export class Address {
  constructor(
    private zipCode: string,
    private street: string,

    private country: string,
    private state: string
  ) {}

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
