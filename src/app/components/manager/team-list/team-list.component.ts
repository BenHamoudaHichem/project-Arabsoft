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
  pagination:Map<string,number>=new Map()
  teamList!: ITeam[];
  constructor(private serviceTeam: TeamService,private AuthenticateService:AuthenticateService,
      @Inject(SESSION_STORAGE) private storage: StorageService
  ) {

  }

  ngOnInit(): void {
    this.all();

  }


  all() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has("status")) {
      urlParams.delete("status")
    }

    let query:string=""
    urlParams.forEach((v,k)=>{
      query=query.concat(k+"="+v+"&")
    })
    query=query.slice(0,-1)
    this.serviceTeam.all(query).subscribe((res) => {
      if (Number(res.headers.get("totalResults"))==0) {

        Report.info('Interventions','Pas de résultat',"Je comprend")
      }
      this.pagination.set("totalResults",Number(res.headers.get("totalResults")))

      this.pagination.set("totalPages",Number(res.headers.get("totalPages")))
      this.pagination.set("page",Number(res.headers.get("page")!))
      this.pagination.set("size",Number(res.headers.get("size")))
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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (!urlParams.has("status")) {
      urlParams.append("status","Available")
    }
    let query:string=""
    urlParams.forEach((v,k)=>{
      query=query.concat(k+"="+v+"&")
    })
    query=query.slice(0,-1)
    this.serviceTeam.all(query).subscribe((res) => {
      this.teamList = res.body!
      this.teamList.forEach(item => {
        item.manager=plainToClass(User,item.manager)

        item.manager.setAddress(plainToClass(Address,item.manager.getAddress()))
        item.members.forEach(subItem => {
          subItem=plainToClass(User,subItem)
          subItem.setAddress(plainToClass(Address,subItem.getAddress()))

        });
      });


    }),
      (error: HttpErrorResponse) => {
        if(error.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        } else{
          Report.failure('Erreur', error.message,'OK')

        }
      }
}


public get hasResult() : boolean {
  return this.teamList !== undefined&& this.teamList.length!==0
}




}
