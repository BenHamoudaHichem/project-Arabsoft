import { User } from '../user';

export class Team {
  constructor(

    private name: string,
    private manager: string,
    private members: User[]
  ) {}



  public getManager(): string {
    return this.manager;
  }
  public setManager(value: string): void {
    this.manager = value;
  }

  public getName(): string {
    return this.name;
  }
  public setName(value: string): void {
    this.name = value;
  }
  public getMembers(): User[] {
    return this.members;
  }
  public setMembers(value: User[]): void {
    this.members = value;
  }
}
