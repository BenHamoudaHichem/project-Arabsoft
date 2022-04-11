import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Report } from 'notiflix';
import { User } from 'src/app/models/user';
import { ITeam } from 'src/app/services/resources/team/iteam';
import { IIntervention } from 'src/app/services/works/intervention/iintervention';
import { InterventionService } from 'src/app/services/works/intervention/intervention.service';

@Component({
  selector: 'app-detail-intervention',
  templateUrl: './detail-intervention.component.html',
  styleUrls: ['./detail-intervention.component.css'],
})
export class DetailInterventionComponent implements OnInit {
  id!: string;
  intervention!: IIntervention;
  status!:string
  ITeam!:User[]
  constructor(
    private interventionService: InterventionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.showDetail(String(this.route.snapshot.paramMap.get('id')));
    if(this.intervention.status=='In_Progress')
    {
this.status='En cours'
    }
    if(this.intervention.status=='Waiting'){
      this.status='En attente'
    }

  }

  // showDetail
  showDetail(id: string) {
    this.interventionService
      .showIntervention(id)
      .subscribe((II: IIntervention) => {
        this.intervention = II;


      }),
      (error: HttpErrorResponse) => {
        Report.warning('Erreur', error.message, 'OK');

        console.log(error.message);
      };
  }


}
