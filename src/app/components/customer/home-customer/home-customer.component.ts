import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate.service';
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
  constructor(private demandService:DemandService,private userService:UserService,private authService:AuthenticateService) {
    this.demandService.allByCustomer(this.authService.authentificatorId).subscribe((res:IDemand[])=>{
      this.demands=res
    })
  }

  ngOnInit(): void {
  }
  public get getDemands():IDemand[]
  {
    return this.demands
  }

}
