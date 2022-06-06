import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthenticateService } from '../authenticate.service';
import { IUser } from './iuser';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiURL = 'http://127.0.0.1:8080/api/users';
  private authHttpOptions = {
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken}`,
      'Content-Type': 'application/json',
    }),
  };
  private responseHeaders = {
    headers: new HttpHeaders({
      "Authorization": `Bearer ${this.authService.getToken}`,
      "Content-Type":"application/json"
    }),
    observe:"response"as "body",
  };
  constructor(
    private http: HttpClient,
    private authService: AuthenticateService
  ) { }
  all(queryparams:string | undefined): Observable<HttpResponse<IUser[]>> {
    let url:string=this.apiURL
    if (queryparams!==undefined) {
      url=url.concat("?".concat(queryparams))
    }

    return this.http.get<HttpResponse<IUser[]>>(`${url}`,this.responseHeaders)
  }


  allByRole(role:string,queryparams:string | undefined): Observable<HttpResponse<IUser[]>> {
    let url:string=this.apiURL
   /* if (queryparams!==undefined) {
      queryparams=queryparams.replace("?","&")
      url=url.concat(queryparams)

    }*/
    return this.http.get<HttpResponse<IUser[]>>(`${url}?role=${role}`,this.responseHeaders)

  }



  create(user: User) {
    console.log( JSON.stringify(user))
    return this.http.post(
      `${this.apiURL}`,
      JSON.stringify(user),
      httpOptions
    );
  }


  findUser(id: string): Observable<HttpResponse<IUser>> {
    return this.http.get<HttpResponse<IUser>>(`${this.apiURL}/${id}`, this.responseHeaders)
  }

  update(user: User,id:string) {
    return this.http.put(
      `${this.apiURL}/${id}`,
      JSON.stringify(user),
      this.authHttpOptions
    );
  }
  agents(queryparams:string | undefined): Observable<HttpResponse<IUser[]>>{
    let url:string=this.apiURL
    if (queryparams!==undefined) {
      queryparams=queryparams.replace("?","&")
      url=url.concat(queryparams)
    }
    return this.http.get<HttpResponse<IUser[]>>(`${this.apiURL}?role=tm&role2=member`,this.responseHeaders)
}


  changePassword(passwordRequest:any)
  {
     return this.http.put(
      `http://127.0.0.1:8080/api/services/password/change`,
      JSON.stringify(passwordRequest),
      this.authHttpOptions
    );
  }
}
