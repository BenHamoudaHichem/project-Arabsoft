import { Dbref } from '../dbref';
import { User } from '../user';

export class Team {
  constructor(

    private name: string,
    private manager: Dbref,
    private members: Dbref[]
  ) {}




  public getName(): string {
    return this.name;
  }
  public setName(value: string): void {
    this.name = value;
  } 
}
