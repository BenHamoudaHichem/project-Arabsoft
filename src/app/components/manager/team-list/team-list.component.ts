import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ITeam } from 'src/app/services/resources/team/iteam';
import { TeamService } from 'src/app/services/resources/team/team.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {

  teamList!: ITeam[];
  constructor(private serviceTeam: TeamService) {
    this.showAll();
  }

  ngOnInit(): void {}

  //Teams
  showAll() {
    this.serviceTeam.all().subscribe((IT: ITeam[]) => {
      this.teamList = IT;
    }),
      (error: HttpErrorResponse) => {
        alert(error.message);
      };
  }

}
