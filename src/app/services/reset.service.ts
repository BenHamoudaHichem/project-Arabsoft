import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookiesService } from './cookies.service';

@Injectable({
  providedIn: 'root'
})
export class ResetService {

  private apiURL = 'http://127.0.0.1:8080/api/services';
  constructor(private http: HttpClient, private router: Router,private cookies:CookiesService) {}


  public forget(mail:string) : Observable<any> {

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),}

    return this.http.post<Observable<any>>(`${this.apiURL}/forget-password`,JSON.stringify(new Text(mail).textContent),httpOptions)
  }
  public reset(token:string,newPassword:string) : Observable<any> {
    let    headers = {
      headers: new HttpHeaders({
        "Authorization": `${new Text(token).textContent}`,
        'Content-Type': 'application/json',

      }),
    };
    return this.http.post<Observable<any>>(`${this.apiURL}/reset-password`,JSON.stringify(new Text(newPassword).textContent),headers)
  }
  public check(token:string) : Observable<any> {
    let headers = {
      headers: new HttpHeaders({
        "Authorization": `${new Text(token).textContent}`,

      }),
    };
    return this.http.get<Observable<any>>(`${this.apiURL}/reset-password/check`,headers)
  }


}
