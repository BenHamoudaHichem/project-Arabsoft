export class Category {

  constructor(
    private id: string | null,
    private name: string) {}

  public getName(): string {
    return this.name;
  }
  public setName(value: string): void {
    this.name = value;
  }
  public getId(): string|null {
    return this.id;
  }
  public setId(value: string) {
    this.id = value;
  }
}
