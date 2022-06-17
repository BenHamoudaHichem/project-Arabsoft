import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { Confirm, Report } from 'notiflix';
import { finalize } from 'rxjs';
import { Address } from 'src/app/models/Address';
import { User } from 'src/app/models/user';
import { DemandService } from 'src/app/services/works/demand/demand.service';
import { IDemand } from 'src/app/services/works/demand/idemand';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { MapService } from 'src/app/services/map/map.service';
import { Demand } from 'src/app/models/works/demand';

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
    private AuthenticateService:AuthenticateService,
    private MapService:MapService
  ) {
    this.route.snapshot.paramMap.get("id");
   // console.log(String(this.route.snapshot.paramMap.get("id")))
    if(this.route.snapshot.paramMap.has("id"))
   { this.findDemand(String(this.route.snapshot.paramMap.get("id")));}

  }

  ngOnInit(): void {}


findDemand(id:string) {
  this.demandService.findDemand(id).pipe(finalize(()=>this.demand.title===undefined)).subscribe((res)=>{
   this.demand=res.body! as IDemand;
   this.demand.address=plainToClass(Address,res.body!.address)

   this.demand.user=plainToClass(User,res.body!.user)
   this.MapService.findLocation(this.demand.address.Location())
  // console.log((this.demand))
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
   hideButton():boolean
  {
    if (this.demand.status=="Accepted"||this.demand.status=="Refused" )  {
      return true
    }

    return false
  }


  rejectDemand(){
    let demand=new Demand(this.demand.title,this.demand.description,this.demand.address,this.demand.createdAt,'Refused', {id:this.demand.user.getId()})

    Confirm.show(
      'Confirmation',
      'Vous êtes sûr de rejeter cette demande ?',
      'Oui',
      'Non',
      () => {

        this.demandService.update(String(this.route.snapshot.paramMap.get("id")),demand).subscribe((res:any)=>{
       //   console.log(res)
       if(res.status==true)
{Report.success("Succées",'Votre demande est rejetée avec succée',"OK")

}
    })

      },
      () => {
        setTimeout(() => {
          window.location.reload();
        }, 2);
      },
      {
      },)


  }

}
