import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { User } from 'src/app/models/user';
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
  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute
  ) {

    if(this.route.snapshot.paramMap.has("id")){
    this.showTeams(String(this.route.snapshot.paramMap.get("id")));}
  }

  ngOnInit(): void {
    console.log(this.team.members[0])
  }


// showDetail
  showTeams(id:string) {

    this.teamService.getTeam(id).subscribe((res:ITeam)=>{
      this.team=res


      this.team.manager=plainToClass(User,res.manager)
      this.team.members=Array.from(res.members,x=> plainToClass(User,x))

      console.log(this.team)
    }),(error:HttpErrorResponse)=>{
      Report.warning('Erreur',error.message,'OK')
    };
  }
}
