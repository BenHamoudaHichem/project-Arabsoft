import { Category } from '../Category';
import { Dbref } from '../dbref';
import { Material } from '../resources/Material';

export class Intervention {
  constructor(
    protected title: string,
    protected description: string,
    protected category: Dbref,
    protected startedAt: Date,
    protected status: string,
    protected demandList:Dbref[],
    protected team:Dbref,
    protected createdAt: Date,
    protected materials:Dbref[]
  ) {}



  public getTeam(): Dbref {
    return this.team;
  }
  public setTeam(value: Dbref): void {
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

  public getCategory(): Dbref {
    return this.category;
  }
  public setCategory(value: Dbref): void {
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
