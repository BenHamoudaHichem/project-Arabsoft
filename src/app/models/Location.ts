export class Location {
  constructor(

    private longitude: number,
    private latitude: number
  ) {}
 
  public getLongitude(): number {
    return this.longitude;
  }
  public setLongitude(value: number): void {
    this.longitude = value;
  }
  public getLatitude(): number {
    return this.latitude;
  }
  public setLatitude(value: number): void {
    this.latitude = value;
  }
}
