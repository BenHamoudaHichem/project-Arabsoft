import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Report } from 'notiflix';
import { AuthenticateService } from 'src/app/services/authenticate.service';
declare const hich:any;
@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  constructor(private authService:AuthenticateService,private route:Router) { }

  ngOnInit(): void {

  }
  checkIsHere()

{
  return this.route.url.includes('List')
}  public get isCustumer():boolean
  {
    return this.authService.isCustumer
  }
  public get isManager():boolean
  {
    return this.authService.isMANAGER
  }
  onLogout()
  {
    this.authService.logout.subscribe((res:any)=>{
      if (res.status) {
        this.authService.onLogoutSucess
        Report.success(
          "Notification de déconnexion",res.message,"D'accord"
          )
          this.route.navigate(['/home'])

      } else {
        Report.warning(
          "Notification de déconnexion",res.message,"D'accord"
          )
      }
    },error=>{this.route.navigate(['/home'])})
  }
}
