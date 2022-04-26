import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { Report } from 'notiflix';
import { finalize } from 'rxjs';
import { Address } from 'src/app/models/Address';
import { User } from 'src/app/models/user';
import { DemandService } from 'src/app/services/works/demand/demand.service';
import { IDemand } from 'src/app/services/works/demand/idemand';
import { Router } from '@angular/router';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { MapService } from 'src/app/services/map/map.service';

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
    private route: ActivatedRoute,
    private router:Router,
    private AuthenticateService:AuthenticateService,
    private MapService:MapService
  ) {
    this.route.snapshot.paramMap.get("id");
    console.log(String(this.route.snapshot.paramMap.get("id")))
    if(this.route.snapshot.paramMap.has("id"))
   { this.showDetail(String(this.route.snapshot.paramMap.get("id")));}

  }

  ngOnInit(): void {}


// showDetail
showDetail(id:string) {
  this.demandService.showDemande(id).pipe(finalize(()=>this.demand.title===undefined)).subscribe((res:IDemand)=>{
   this.demand=res as IDemand;
   this.demand.address=plainToClass(Address,res.address)

   this.demand.user=plainToClass(User,res.user)
   this.MapService.getLocation(this.demand.address.Location())
   console.log((this.demand))
 }),(error:HttpErrorResponse)=>{
  if(error.status==401){
    this.AuthenticateService.redirectIfNotAuth()

  } else{
    Report.failure('Erreur', error.message,'OK')

  }      };
}

  get status():string{
    let res = "Acceptée"
    if (this.demand.status=="In_Progress") {
      res="Réclamation en cours de traitement"
    }
    if (this.demand.status=="Refused") {
      res="Réclamation rejetée"
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
  accept()
  {
    localStorage.setItem("_id",this.demand.id)
    this.router.navigate(["/dashboard/manager/createIntervention"])
  }
}
