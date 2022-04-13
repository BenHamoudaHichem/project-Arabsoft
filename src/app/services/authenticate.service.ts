import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Report } from 'notiflix';
import { lastValueFrom, map, Observable } from 'rxjs';
import { CookiesService } from './cookies.service';
import { IUser } from './user/iuser';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  private apiURL = 'http://127.0.0.1:8080/api/auth';
  constructor(private http: HttpClient, private router: Router,private cookies:CookiesService) {

   // this.doCheck()
  }


  public  login(email: string, password: string) {

    return  this.http.post(`${this.apiURL}/login`,{ identifier: email, password: password },httpOptions)
  }

  public get logout() {
    let options = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken}`,
      }),
    };
    let token = this.getToken;

    return this.http.get(
      `${this.apiURL}/logout`,
      options
    );
  }



  public get isLogin() : boolean {
    return (this.getToken != null &&this.getToken != undefined)
  }



  //Token service
  public get getToken() {
    if (this.cookies.getToken)
    {
      return this.cookies.getToken!;

    }
    return null;
  }



  get getUsername():string{
    return this.cookies.getUsername
  }

  onLoginSucces(token:string,username:string,id:string,role:string)
  {
    this.cookies.createToken(token)
    this.cookies.addUserId(id)
    this.cookies.addUserRole(role)
    this.cookies.addUsername(username)
  }
  onLogoutSucess()
  {
    this.cookies.deleteAll()
  }

  public get authentificatorId():string
  {
    return this.cookies.getIdentifier
  }


  redirectIfNotAuth() {
    Report.warning("Connexion perdu",'Vous devez reconnecter Session expirée',"Je compris");
    this.router.navigate(['/login']);
  }
  public get checkUser() : Observable<any> {
    return this.http.get<any>(`${this.apiURL}/current`,httpOptions).pipe(
      map((user: any) => {
        return user;
      })
    )
  }


  get isCustumer():boolean
  {
    return this.cookies.getRole==CookiesService.ROLE_CUSTOMER
  }
  get isMANAGER():boolean
  {
    return this.cookies.getRole==CookiesService.ROLE_MANAGER
  }

}
