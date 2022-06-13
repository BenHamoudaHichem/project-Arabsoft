import { Address } from '../Address';
import { Dbref } from '../dbref';
import { MaterialUsed } from '../resources/MaterialUsed';

export class Intervention {
  constructor(
    protected id:string|undefined=undefined,
    protected title: string,
    protected description: string,
    protected category: Dbref,
    protected address:Address,
    protected startedAt: string,
    protected expiredAt: string,
    protected demandList:Dbref[],
    protected materialsToBeUsed:MaterialUsed[],
    protected team:Dbref,
    protected status: string
  ) {}


  public getDemandList(): Dbref[] {
    return this.demandList;
  }
  public setDemandList(value: Dbref[]): void {
    this.demandList = value;
  }

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
  public getExpiredAt(): string {
    return this.expiredAt;
  }
  public setExpiredAt(value: string): void {
    this.expiredAt = value;
  }

  public getStatus(): string {
    return this.status;
  }
  public setStatus(value: string): void {
    this.status = value;
  }

  public static get value() : string[] {
    return Object.keys(Reflect.construct(Intervention, []))
  }

}
