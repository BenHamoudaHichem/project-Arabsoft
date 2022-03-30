import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate.service';
declare const hich:any;
@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  constructor(private authService:AuthenticateService) { }

  ngOnInit(): void {

  }
  public get isCustumer():boolean
  {
    return this.authService.isCustumer
  }
  public get isManager():boolean
  {
    return this.authService.isMANAGER
  }
}
