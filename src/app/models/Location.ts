export class Location {
  constructor(

    private longitude: number,
    private latitude: number
  ) {}

  public get Longitude(): number {
    return this.longitude;
  }
  public setLongitude(value: number): void {
    this.longitude = value;
  }
  public get Latitude(): number {
    return this.latitude;
  }
  public setLatitude(value: number): void {
    this.latitude = value;
  }
}
