import { FnParam } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DefaultLangChangeEvent, DEFAULT_LANGUAGE, MissingTranslationHandler, TranslateService } from '@ngx-translate/core';
import { plainToClass } from 'class-transformer';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import Notiflix, { Notify, Report } from 'notiflix';
import { filter } from 'rxjs';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { FiltreComponent } from '../filtre/filtre.component';
type Params = {
  [key: string]: any;
};
@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  curentUrl!:string
  @ViewChild(FiltreComponent) filtercomponent!:FiltreComponent
  constructor(private authService:AuthenticateService,private route:Router , private activatedRoute: ActivatedRoute,public  translate:TranslateService,@Inject(SESSION_STORAGE) private storage: StorageService) {
    this.translate.use(this.storage.get("Lang"));
    console.log(String(this.route.url));

  }

  ngOnInit(): void {




  }
 public listenSearch()
  {
    let qParams: Map<any,any>=new Map()
    qParams=plainToClass(Map,this.activatedRoute.snapshot.queryParams)
    qParams.forEach((x,y)=>{
      if (!(x.includes("status")||x.includes("role"))) {
        qParams.delete(x)
      }
    })
    this.filtercomponent.getFilter!.forEach((x,y)=>{
      qParams.set(y,x)
    })


    let url:string=this.route.url
    if (this.route.url.includes("?")) {
      url=url.substring(0,url.indexOf("?"))
    }

    console.log(qParams);


  this.route.navigate(
    [String(url)],
    {
      relativeTo: this.activatedRoute,
      queryParams: Object.fromEntries(qParams),
    });
    this.filtercomponent.getFilter?.clear()
    this.route.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }
  isList()
{
  return this.route.url.includes('List')
}
 public get isCustomer():boolean
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
        Notify.success(
          "Au revoir"
            )
        this.route.navigate(['/home'])



      }
    ,error=>{
      this.authService.onLogoutSucess()
      Notify.success(
        "Au revoir"
          )
      this.route.navigate(['/home'])


    })
  }
 //Switch language
  translateLanguageTo(lang: string) {

    this.storage.set("Lang",lang)

    this.translate.use(this.storage.get("Lang"));
    if(this.route.url=='/dashboard/manager/home' || this.route.url.includes('teamList')||this.route.url.includes('materialList'))
    {
      setTimeout(() => {
        window.location.reload();
      }, 10);
    }

  }
  public get username():string{
    return this.authService.getUsername
  }
  }
