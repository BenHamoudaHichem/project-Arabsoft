export class Dbref {
  public getId(): string {
    return this.id;
  }
  public setId(value: string) {
    this.id = value;
  }
  public constructor(private id: string){}

}
