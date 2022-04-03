import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Report } from 'notiflix';
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
    this.route.snapshot.paramMap.get("id");
    console.log(String(this.route.snapshot.paramMap.get("id")))
    if(this.route.snapshot.paramMap.has("id"))
   { this.showDetail(String(this.route.snapshot.paramMap.get("id")));}

  }

  ngOnInit(): void {}


// showDetail
  showDetail(id:string) {
    this.demandService.showDemande(id).subscribe((ID:IDemand)=>{
      this.demand=ID;
    }),(error:HttpErrorResponse)=>{
      Report.warning('Erreur',error.message,'OK')
    };
  }
}
