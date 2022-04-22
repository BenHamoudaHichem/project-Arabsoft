import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticateService } from 'src/app/services/authenticate.service';
import { HomeLoaderService } from 'src/app/services/home/home-loader.service';
import { IHomeCustomer } from 'src/app/services/home/ihome-customer';
import { UserService } from 'src/app/services/user/user.service';
import { DemandService } from 'src/app/services/works/demand/demand.service';
import { IDemand } from 'src/app/services/works/demand/idemand';

@Component({
  selector: 'app-home-customer',
  templateUrl: './home-customer.component.html',
  styleUrls: ['./home-customer.component.css']
})
export class HomeCustomerComponent implements OnInit {

  private demands:IDemand[]=[]
  dataHome!:IHomeCustomer
  constructor(private homeService:HomeLoaderService,private demandService:DemandService,private userService:UserService,private authService:AuthenticateService,public translate:TranslateService) {
    this.demandService.allByCustomer(this.authService.authentificatorId).subscribe((res:IDemand[])=>{
      this.demands=res
    })
    this.homeService.loadHomeForCustomer().subscribe((res:IHomeCustomer)=>{
      this.dataHome=res
    },error=>{
      if(error.code==401){
        this.authService.redirectIfNotAuth()
      }
    })

  }

  ngOnInit(): void {
     console.log(this.authService.isLogin)

  }
  public get getDemands():IDemand[]
  {
    return this.demands
  }
  homeLoader()
  {


  }

}
