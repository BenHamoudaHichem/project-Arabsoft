import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IIntervention } from 'src/app/services/works/intervention/iintervention';
import { InterventionService } from 'src/app/services/works/intervention/intervention.service';

@Component({
  selector: 'app-detail-intervention',
  templateUrl: './detail-intervention.component.html',
  styleUrls: ['./detail-intervention.component.css']
})
export class DetailInterventionComponent implements OnInit {
  id: string;
  intervention!:IIntervention
  constructor(
    private interventionService: InterventionService,
    private ActivatedRoute: ActivatedRoute
  ) {
    this.id = String(this.ActivatedRoute.snapshot.paramMap.get('id'));
    this.showDetail(this.id);
  }

  ngOnInit(): void {
  }


// showDetail
showDetail(id:string) {
  this.interventionService.showIntervention(id).subscribe((II:IIntervention)=>{
    this.intervention=II;
  }),(error:HttpErrorResponse)=>{
    console.log(error.message)
  };
}


}
