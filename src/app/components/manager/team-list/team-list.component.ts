import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { User } from 'src/app/models/user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { ITeam } from 'src/app/services/resources/team/iteam';
import { TeamService } from 'src/app/services/resources/team/team.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {

  teamList!: ITeam[];
  constructor(private serviceTeam: TeamService,private AuthenticateService:AuthenticateService) {

    this.all();
  }

  ngOnInit(): void {
  }


  all() {
    this.serviceTeam.all().subscribe((IT: ITeam[]) => {
      this.teamList = IT

      this.teamList.forEach(item => {
        item.manager=plainToClass(User,item.manager)

        item.manager.setAddress(plainToClass(Address,item.manager.getAddress()))
        item.members.forEach(subItem => {
          subItem=plainToClass(User,subItem)
          subItem.setAddress(plainToClass(Address,subItem.getAddress()))


        });
      });

      console.log(this.teamList)

    }),
      (error: HttpErrorResponse) => {
        if(error.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        } else{
          Report.failure('Erreur', error.message,'OK')

        }        };
  }
  teamAvailable(){
    this.serviceTeam.allByStatus("Available").subscribe((IT: ITeam[]) => {
      this.teamList = IT
      this.teamList.forEach(item => {
        item.manager=plainToClass(User,item.manager)

        item.manager.setAddress(plainToClass(Address,item.manager.getAddress()))
        item.members.forEach(subItem => {
          subItem=plainToClass(User,subItem)
          subItem.setAddress(plainToClass(Address,subItem.getAddress()))

        });
      });

      console.log(this.teamList)

    }),
      (error: HttpErrorResponse) => {
        if(error.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        } else{
          Report.failure('Erreur', error.message,'OK')

        }        };
}







}
