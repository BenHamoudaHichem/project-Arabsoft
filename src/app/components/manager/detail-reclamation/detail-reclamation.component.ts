import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemandService } from 'src/app/services/works/demand/demand.service';
import { IDemand } from 'src/app/services/works/demand/idemand';

@Component({
  selector: 'app-detail-reclamation',
  templateUrl: './detail-reclamation.component.html',
  styleUrls: ['./detail-reclamation.component.css'],
})
export class DetailReclamationComponent implements OnInit {
  demand!: IDemand;
  id!: string;
  constructor(
    private demandService: DemandService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params=>{this.id=params["id"]; console.log(this.id)} )
    console.log(this.id)
    this.showDetail(this.id);
  }

  ngOnInit(): void {}


// showDetail
  showDetail(id:string) {
    this.demandService.showDemande(id).subscribe((ID:IDemand)=>{
      this.demand=ID;
    }),(error:HttpErrorResponse)=>{
      console.log(error.message)
    };
  }
}
