import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Report } from 'notiflix';
import { IUser } from 'src/app/services/user/iuser';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css'],
})
export class MembersListComponent implements OnInit {
  usersList!: IUser[];
  constructor(private UserService: UserService) {}

  ngOnInit(): void {
   this.showAll();
    this.showMembers();
    this.showTManagers();
  }

  showAll() {
    this.UserService.agents().subscribe((res: IUser[]) => {
      console.log(res);
      this.usersList = res;
    }),
      (error: HttpErrorResponse) => {
        Report.failure('Erreur', error.message, 'OK');
      };
  }
  showTManagers(){
    this.UserService.allByRole('tm').subscribe((res: IUser[])=>{
      console.log(res)
      this.usersList=res;
    }),(error:HttpErrorResponse)=>{
      Report.failure('Error getting team manager',error.message,'OK');
  };
}
showMembers(){
  this.UserService.allByRole('member').subscribe((res: IUser[])=>{
    console.log(res)
    this.usersList=res;
  }),(error:HttpErrorResponse)=>{
    Report.failure('Error getting members',error.message,'OK');
};
}
convertRole(roles:any[]):string
{
    if (roles[0].name =="ROLE_TEAMMANAGER") {
      return "Chef d'équipe"

    }

  return 'Employée'
}

}
