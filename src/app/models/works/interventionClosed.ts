import { Address } from '../Address';
import { Dbref } from '../dbref';
import { Team } from '../resources/team';
import { Intervention } from './intervention';

export class InterventionClosed extends Intervention {
  constructor(
    title: string,
    description: string,
    category: Dbref,
    address: Address,
    startedAt: string,
    expiredAt: string,
    demandList: Dbref[],
    materialList: Dbref[],
    team: Dbref,
    status: string,
    private closingComment: string,
    private closedDate: Date,
    private workingGroup: Team
  ) {
    super(
      title,
      description,
      category,
      address,
      startedAt,
      expiredAt,
      demandList,
      materialList,
      team,
      status
    );
  }
  public getClosingComment(): string {
    return this.closingComment;
  }
  public setClosingComment(value: string): void {
    this.closingComment = value;
  }

  public getClosedDate(): Date {
    return this.closedDate;
  }
  public setClosedDate(value: Date): void {
    this.closedDate = value;
  }

 


  public getworkingGroup(): Team {
    return this.workingGroup;
  }
  public setworkingGroup(value: Team): void {
    this.workingGroup = value;
  }
}
