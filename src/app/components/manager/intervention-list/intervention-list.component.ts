import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IIntervention } from 'src/app/services/works/intervention/iintervention';
import { InterventionService } from 'src/app/services/works/intervention/intervention.service';

@Component({
  selector: 'app-intervention-list',
  templateUrl: './intervention-list.component.html',
  styleUrls: ['./intervention-list.component.css'],
})
export class InterventionListComponent implements OnInit {
  interventionList!: IIntervention[];
  constructor(private serviceIntervention: InterventionService) {
    this.showAll()
  }

  ngOnInit(): void {}

  //Interventions
  showAll() {
    this.serviceIntervention.all().subscribe((II: IIntervention[]) => {
      this.interventionList = II;
    }),
      (error: HttpErrorResponse) => {
        alert(error.message);
      };
  }
}
