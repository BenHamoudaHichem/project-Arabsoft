import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
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
  constructor(private serviceTeam: TeamService,private AuthenticateService:AuthenticateService,
      @Inject(SESSION_STORAGE) private storage: StorageService
  ) {

    this.all();
  }

  ngOnInit(): void {
  }


  all() {
    let queryParams:string|undefined
    if (window.location.href.includes("?")) {
      queryParams=window.location.href.substring(window.location.href.indexOf("?")+1)
    }
    this.serviceTeam.all(queryParams).subscribe((res) => {
      this.storage.set("totalResults",res.headers.get("totalResults"))
      this.storage.set("totalPages",res.headers.get("totalPages"))
      this.storage.set("page",Number(res.headers.get("page")!))
      this.storage.set("size",res.headers.get("size"))
      this.teamList = res.body!

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
    this.serviceTeam.allByStatus("Available").subscribe((res) => {
      this.teamList = res.body!
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

        }        }
}







}
