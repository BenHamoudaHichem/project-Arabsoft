import { User } from '../user';

export class Team {
  constructor(

    private name: string,
    private manager: {id:string},
    private members: {id:string}[]
  ) {}



  public getManager():  {id:string} {
    return this.manager;
  }
  public setManager(value:  {id:string}): void {
    this.manager = value;
  }

  public getName(): string {
    return this.name;
  }
  public setName(value: string): void {
    this.name = value;
  }
  public getMembers(): {id:string}[] {
    return this.members;
  }
  public setMembers(value: {id:string}[]): void {
    this.members = value;
  }
}
