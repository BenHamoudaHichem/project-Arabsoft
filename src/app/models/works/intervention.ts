import { Category } from '../Category';
import { Material } from '../resources/Material';

export class Intervention {
  constructor(
    protected title: string,
    protected description: string,
    protected category: Category,
    protected startedAt: Date,
    protected status: string,
    protected demandList:{id:string}[],
    protected team:string,
    protected createdAt: Date,
    protected materials:Material[]
  ) {}



  public getTeam(): string {
    return this.team;
  }
  public setTeam(value: string): void {
    this.team = value;
  }

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

  public getCategory(): Category {
    return this.category;
  }
  public setCategory(value: Category): void {
    this.category = value;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
  public setCreatedAt(value: Date): void {
    this.createdAt = value;
  }

  public getStartedAt(): Date {
    return this.startedAt;
  }
  public setStartedAt(value: Date): void {
    this.startedAt = value;
  }
}
