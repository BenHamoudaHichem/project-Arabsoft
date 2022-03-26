import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Report } from 'notiflix';
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
  constructor(
    private interventionService: InterventionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params=>{this.id=params["id"]; console.log(this.id)} )

    this.showDetail(this.id);
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
