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
    this.route.queryParams.subscribe(params=>{this.id=params["id"]; console.log(this.id)} )
    console.log(this.id)
    this.showTeams(this.id);
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
