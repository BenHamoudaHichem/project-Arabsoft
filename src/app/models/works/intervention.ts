import { Address } from '../Address';
import { Category } from '../Category';
import { Dbref } from '../dbref';
import { Material } from '../resources/Material';

export class Intervention {
  constructor(
    protected title: string,
    protected description: string,
    protected category: Dbref,
    protected address:Address,
    protected startedAt: string,
    protected demandList:Dbref[],
    protected materialList:Dbref[],
    protected team:Dbref,
    protected status: string
  ) {}



  public getTeam(): Dbref {
    return this.team;
  }
  public setTeam(value: Dbref): void {
    this.team = value;
  }

  public getAddress(): Address {
    return this.address;
  }
  public setAddress(value: Address): void {
    this.address = value;
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


  public getStartedAt(): string {
    return this.startedAt;
  }
  public setStartedAt(value: string): void {
    this.startedAt = value;
  }
}
