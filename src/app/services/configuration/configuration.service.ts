import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Report } from 'notiflix';
import { AuthenticateService } from '../authenticate.service';
import { CookiesService } from '../cookies.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private static counter:number=0;
  constructor(private http:HttpClient,private router:Router,private authService:AuthenticateService,private cookiesService:CookiesService)
  {

    ConfigurationService.counter=++ConfigurationService.counter
    console.log(ConfigurationService.counter)
  }
  private options = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken}`,
    }),
  };

  public init()
  {
   
}
private get isFirstStep() : boolean {
  return ConfigurationService.counter===1
}

}
