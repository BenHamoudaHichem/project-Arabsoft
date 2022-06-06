import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Intervention } from 'src/app/models/works/intervention';
import { AuthenticateService } from '../../authenticate.service';
import { IIntervention } from './iintervention';

@Injectable({
  providedIn: 'root',
})
export class InterventionService {
  headers = {
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken}`,
      "Content-Type":"application/json"
    }),
  };
  private responseHeaders = {
    headers: new HttpHeaders({
      "Authorization": `Bearer ${this.authService.getToken}`,
      "Content-Type":"application/json"
    }),
    observe:"response"as "body",
  };
  private apiURL = 'http://127.0.0.1:8080/api/interventions';

  constructor(
    private http: HttpClient,
    private authService: AuthenticateService
  ) {}
  all(queryparams:string | undefined): Observable<HttpResponse<IIntervention[]>> {
    let url:string=this.apiURL
    if (queryparams!==undefined) {
      url=url.concat("?".concat(queryparams))
    }
    return this.http.get<HttpResponse<IIntervention[]>>(`${url}`,this.responseHeaders)
  }


  allByStatus(status:string): Observable<HttpResponse<IIntervention[]>> {
    let url:string=this.apiURL

    return this.http.get<HttpResponse<IIntervention[]>>(`${url}?status=${status}`,this.responseHeaders)
  }

  create(intervention: Intervention): Observable<Intervention> {
console.log(JSON.stringify(intervention))
    return this.http.post<Intervention>(
      `${this.apiURL}`,
      JSON.stringify(intervention),
      this.headers
    );
  }
  update(intervention: Intervention,id:String): Observable<Intervention> {

    return this.http.put<Intervention>(
      `${this.apiURL}/${id}`,
      JSON.stringify(intervention),
      this.headers
    );
  }

  findIntervention(id: string): Observable<HttpResponse<IIntervention>> {
    return this.http.get<HttpResponse<IIntervention>>(`${this.apiURL}/${id}`, this.responseHeaders)

  }


}
