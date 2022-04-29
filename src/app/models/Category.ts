export class Category {
  constructor(private name: string) {}

  public getName(): string {
    return this.name;
  }
  public setName(value: string): void {
    this.name = value;
  }
}
