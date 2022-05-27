import { Address } from '../Address';
import { Dbref } from '../dbref';
import { MaterialUsed } from '../resources/MaterialUsed';
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
    materialsToBeUsed: MaterialUsed[],
    team: Dbref,
    status: string,
    private closingComment: string,
    private closedDate: Date,
    private materialUsedList:MaterialUsed[],
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
      materialsToBeUsed,
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
  public getMaterialUsedList(): MaterialUsed[] {
    return this.materialUsedList;
  }
  public setMaterialUsedList(value: MaterialUsed[]): void {
    this.materialUsedList = value;
  }




  public getworkingGroup(): Team {
    return this.workingGroup;
  }
  public setworkingGroup(value: Team): void {
    this.workingGroup = value;
  }
}
