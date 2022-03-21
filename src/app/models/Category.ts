export class Category {
  constructor(private eCategory: string) {}
 
  public geteCategory(): string {
    return this.eCategory;
  }
  public seteCategory(value: string): void {
    this.eCategory = value;
  }
}
