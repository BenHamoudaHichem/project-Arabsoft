import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ComponentFactory, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Report } from 'notiflix';
import { AuthenticateService } from '../authenticate.service';
import { CookiesService } from '../cookies.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private http:HttpClient,private router:Router,private authService:AuthenticateService,private cookiesService:CookiesService) {}
  private options = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken}`,
    }),
  };
  public init()
  {

    return new Promise((resolve, reject) => {
      this.http
        .get("http://127.0.0.1:8080/api/auth/current",this.options)
        .subscribe((response: any) => {

          console.log(response)
          if (response.status==true) {
            if (this.authService.isCustumer) {

              this.router.navigate(['/dashboard/customer/home'])
            }
            if (this.authService.isMANAGER) {

              this.router.navigate(['/dashboard/manager/home'])
            }
          } else {
          
            Report.warning("Connexion","Vous devez rconnecter","D'accord")
            this.authService.onLogoutSucess()
            this.router.navigate(['/login'])
          }



          resolve(true);
        });
    });
}
}
