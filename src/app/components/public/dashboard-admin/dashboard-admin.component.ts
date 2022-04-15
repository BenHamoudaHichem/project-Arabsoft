import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DefaultLangChangeEvent, DEFAULT_LANGUAGE, MissingTranslationHandler, TranslateService } from '@ngx-translate/core';
import { Report } from 'notiflix';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { CookiesService } from 'src/app/services/cookies.service';
declare const hich:any;
@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  constructor(private authService:AuthenticateService,private route:Router,public  translate:TranslateService) {
    this.translateLanguageTo(translate.defaultLang)
  }

  ngOnInit(): void {


  }
  checkIsHere()

{
  return this.route.url.includes('List')
}  public get isCustomer():boolean
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
        this.authService.onLogoutSucess()
        Report.success(
          "Notification de déconnexion",res.message,"D'accord"
          )
          this.route.navigate(['/home'])

      } else {
        this.route.navigate(['/home'])
        Report.warning(
          "Notification de déconnexion",res.message,"D'accord"
          )
      }
    },error=>{
      this.authService.onLogoutSucess()
      this.route.ngOnDestroy()
      Report.warning(
        "Notification de déconnexion",error.message,"D'accord"
        )

    })
  }
 //Switch language
  translateLanguageTo(lang: string) {
    this.translate.use(lang);

  }
  public get username():string{
    return this.authService.getUsername
  }
  }
