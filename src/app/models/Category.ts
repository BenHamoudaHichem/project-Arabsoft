export class Category {
  constructor(private name: string) {}

  public getNameCategory(): string {
    return this.name;
  }
  public setNameCategory(value: string): void {
    this.name = value;
  }
}
