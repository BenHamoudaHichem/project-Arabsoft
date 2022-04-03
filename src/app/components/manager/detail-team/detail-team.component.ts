import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Report } from 'notiflix';
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

  ngOnInit(): void {}


// showDetail
  showTeams(id:string) {
    this.teamService.getTeam(id).subscribe((ID:ITeam)=>{
      this.team=ID;
    }),(error:HttpErrorResponse)=>{
      Report.warning('Erreur',error.message,'OK')
    };
  }
}
