import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { User } from 'src/app/models/user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { IUser } from 'src/app/services/user/iuser';
import { UserService } from 'src/app/services/user/user.service';
import { DemandService } from 'src/app/services/works/demand/demand.service';
import { IDemand } from 'src/app/services/works/demand/idemand';

@Component({
  selector: 'app-details-customer',
  templateUrl: './details-customer.component.html',
  styleUrls: ['./details-customer.component.css']
})
export class DetailsCustomerComponent implements OnInit {
user!:IUser
demandList!:IDemand[]
  constructor(private route:ActivatedRoute,
    private userService:UserService,
    private demandService:DemandService,
    private AuthenticateService:AuthenticateService
    ) {


this.findUser()
this.demandsByUser() }

  ngOnInit(): void {

  }


  demandsByUser()
  {
    this.demandService.allByUser(String(this.route.snapshot.paramMap.get('id'))).subscribe((res:IDemand[])=>{
      this.demandList=res

      console.log(this.demandList)

    }),

  (error: HttpErrorResponse) => {
    if(error.status==401){
      this.AuthenticateService.redirectIfNotAuth()

    } else{
      Report.failure('Erreur', error.message,'OK')

    }    };
  }

findUser(){
  this.userService.findUser(String(this.route.snapshot.paramMap.get('id')))
  .subscribe((res) => {
    this.user = res.body!;
    this.user.address=plainToClass(Address,res.body!.address)
  }),
  (error: HttpErrorResponse) => {
    if(error.status==401){
      this.AuthenticateService.redirectIfNotAuth()

    } else{
      Report.failure('Erreur', error.message,'OK')

    }    };
}

 status(demand:IDemand):string{
  let res = "Acceptée"
  if (demand.status=="In_Progress") {
    res="La reclamation est en cours de traitement"
  }
  if (demand.status=="Refused") {
    res="Réclamation rejetée"
  }

  return res
}

}


