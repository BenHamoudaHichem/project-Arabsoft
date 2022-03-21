import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DemandService } from 'src/app/services/works/demand/demand.service';
import { IDemand } from 'src/app/services/works/demand/idemand';

@Component({
  selector: 'app-reclamation-list',
  templateUrl: './reclamation-list.component.html',
  styleUrls: ['./reclamation-list.component.css']
})
export class ReclamationListComponent implements OnInit {

  demandList!: IDemand[];
  constructor(private serviceDemand: DemandService) {
    this.showAll();
  }

  ngOnInit(): void {}

  //Demands
  showAll() {
    this.serviceDemand.all().subscribe((ID: IDemand[]) => {
      this.demandList = ID;
    }),
      (error: HttpErrorResponse) => {
        alert(error.message);
      };
  }

}
