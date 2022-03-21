
export class Demand {
  constructor(

    private title: string,
    private description: string,
    private createdAt: Date,
    private location: string,
    private user: string,
    private status: string
  ) {}



  public getTitle(): string {
    return this.title;
  }
  public setTitle(value: string): void {
    this.title = value;
  }

  public getDescription(): string {
    return this.description;
  }
  public setDescription(value: string): void {
    this.description = value;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }
  public setCreatedAt(value: Date): void {
    this.createdAt = value;
  }

  public getStatus(): string {
    return this.status;
  }
  public setStatus(value: string): void {
    this.status = value;
  }

  public getUser(): string {
    return this.user;
  }
  public setUser(value: string): void {
    this.user = value;
  }
  public getLocation(): string {
    return this.location;
  }
  public setLocation(value: string): void {
    this.location = value;
  }
}
