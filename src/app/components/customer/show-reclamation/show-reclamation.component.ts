import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { Loading, Report } from 'notiflix';
import { finalize } from 'rxjs';
import { Address } from 'src/app/models/Address';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { DemandService } from 'src/app/services/works/demand/demand.service';
import { IDemand } from 'src/app/services/works/demand/idemand';

@Component({
  selector: 'app-show-reclamation',
  templateUrl: './show-reclamation.component.html',
  styleUrls: ['./show-reclamation.component.css']
})
export class ShowReclamationComponent implements OnInit {
  demand!: IDemand;
  id!: string;

  constructor(
    private demandService: DemandService,
    private route: ActivatedRoute,
    private AuthenticateService:AuthenticateService
  ) {
    this.route.snapshot.paramMap.get("id");
    console.log(String(this.route.snapshot.paramMap.get("id")))
    if(this.route.snapshot.paramMap.has("id"))
   { //this.findDemand(String(this.route.snapshot.paramMap.get("id")))
  }

  }

  ngOnInit(): void {
    this.findDemand(String(this.route.snapshot.paramMap.get("id")))

  }


// findDemand
  findDemand(id:string) {
     this.demandService.findDemand(id).pipe(finalize(()=>this.demand.title===undefined)).subscribe((res)=>{
      this.demand=res.body! as IDemand;
      this.demand.address=plainToClass(Address,res.body!.address)}),(error:HttpErrorResponse)=>{
      if(error.status==401){
        this.AuthenticateService.redirectIfNotAuth()

      }else{
        Report.failure('Erreur', error.message,'OK')
      }
    };
  }
  get status():string{
    let res = "Acceptée"
    if (this.demand.status=="In_Progress") {
      res="nous sommes en train d'étudier cette réclamation"
    }
    if (this.demand.status=="Refused") {
      res="Malheureusement on ne peut pas accepter votre réclamation"
    }

    return res
  }
  get icon():number
  {
    if (this.demand.status=="In_Progress") {
      return 2
    }
    if (this.demand.status=="Refused") {
return 0
    }

    return 1
  }

}
