import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DefaultLangChangeEvent, DEFAULT_LANGUAGE, MissingTranslationHandler, TranslateService } from '@ngx-translate/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Report } from 'notiflix';
import { AuthenticateService } from 'src/app/services/authenticate.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  constructor(private authService:AuthenticateService,private route:Router,public  translate:TranslateService,@Inject(SESSION_STORAGE) private storage: StorageService) {
    this.translate.use(this.storage.get("Lang"));

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

        this.authService.onLogoutSucess()

          Report.success(
            "Notification de déconnexion","Au revoir","D'accord"
            )

      }
    ,error=>{
      this.authService.onLogoutSucess()
      this.route.navigate(['/home'])
      Report.success(
        "Notification de déconnexion","Au revoir","D'accord"
        )

    })
  }
 //Switch language
  translateLanguageTo(lang: string) {

    this.storage.set("Lang",lang)

    this.translate.use(this.storage.get("Lang"));

  }
  public get username():string{
    return this.authService.getUsername
  }
  }
