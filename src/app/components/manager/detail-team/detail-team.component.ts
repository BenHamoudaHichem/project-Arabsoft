import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { User } from 'src/app/models/user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { ITeam } from 'src/app/services/resources/team/iteam';
import { TeamService } from 'src/app/services/resources/team/team.service';

@Component({
  selector: 'app-detail-team',
  templateUrl: './detail-team.component.html',
  styleUrls: ['./detail-team.component.css']
})
export class DetailTeamComponent implements OnInit {

  team!: ITeam;
  id!: string;
  linkIntervention:String | null= null
  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private AuthenticateService:AuthenticateService,

  ) {

    if(this.route.snapshot.paramMap.has("id")){
    this.findTeam(String(this.route.snapshot.paramMap.get("id")));}
  }

  ngOnInit(): void {
    console.log(this.team.members[0])
  }



  findTeam(id:string) {

    this.teamService.findTeam(id).subscribe((res)=>{
      this.team=res.body!
      this.team.manager=plainToClass(User,res.body!.manager)
      this.team.members=Array.from(res.body!.members,x=> plainToClass(User,x))
      if (res.headers.get("hasIntervention")=="true") {
        this.linkIntervention=res.headers.get("currrentIntervention")
        console.log(this.linkIntervention);

      }

    }),(error:HttpErrorResponse)=>{
      if(error.status==401){
        this.AuthenticateService.redirectIfNotAuth()

      } else{
        Report.failure('Erreur', error.message,'OK')

      }      };
  }
}
