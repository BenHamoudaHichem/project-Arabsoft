import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IIntervention } from 'src/app/services/works/intervention/iintervention';
import { InterventionService } from 'src/app/services/works/intervention/intervention.service';

@Component({
  selector: 'app-intervention-list',
  templateUrl: './intervention-list.component.html',
  styleUrls: ['./intervention-list.component.css'],
})
export class InterventionListComponent implements OnInit {
  interventionList!: IIntervention[];
  status!:string
  constructor(private serviceIntervention: InterventionService,private route:ActivatedRoute) {
    this.showPerStatus()
  }

  ngOnInit(): void {}

  //Interventions
  showPerStatus()
  {
    this.route.queryParams.subscribe(params=>{this.status=params["status"]; console.log(this.status)} )

    this.serviceIntervention.interventionPerStatus(this.status).subscribe((II: IIntervention[]) => {
      this.interventionList = II;
    }),
      (error: HttpErrorResponse) => {
        alert(error.message);
      };
  }
}
