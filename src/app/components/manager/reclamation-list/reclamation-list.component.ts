import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Report } from 'notiflix';
import { DemandService } from 'src/app/services/works/demand/demand.service';
import { IDemand } from 'src/app/services/works/demand/idemand';

@Component({
  selector: 'app-reclamation-list',
  templateUrl: './reclamation-list.component.html',
  styleUrls: ['./reclamation-list.component.css']
})
export class ReclamationListComponent implements OnInit {
status!:string
  demandList!: IDemand[];
  constructor(private serviceDemand: DemandService,private route:ActivatedRoute) {
    this.showAll();
  }

  ngOnInit(): void {

    console.log(this.demandList)
  }

  //Demands
  showAll() {
    this.serviceDemand.all().subscribe((ID: IDemand[]) => {
      this.demandList = ID;
      console.log(this.demandList)
    }),
      (error: HttpErrorResponse) => {
        alert(error.message);
      };
  }
  showByStatus(){
    this.route.queryParams.subscribe(params=>{this.status=params["status"]; console.log(this.status)} )

    this.serviceDemand.allByStatus(this.status).subscribe((ID:IDemand[])=>{
      this.demandList=ID
    }),
    (error: HttpErrorResponse) => {
      Report.warning('Erreur',error.message,"OK")
    };
  }



}
