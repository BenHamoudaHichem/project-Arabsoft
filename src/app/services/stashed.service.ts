import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class StashedService {
  headers = {
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken}`,
      "Content-Type":"application/json"
    }),
  }
  private apiURL = 'http://127.0.0.1:8080/api/stasheds';

  constructor(private authService:AuthenticateService,private http:HttpClient) { }

  public  toTheStash(className:string) : Observable<HttpResponse<any>> {
    this.headers.headers.append("className",className)
    return this.http.get<HttpResponse<any>>(this.apiURL,this.headers)
  }

  public  restore(id:string) : Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(`${this.apiURL}/${id}`,this.headers)
  }

}
