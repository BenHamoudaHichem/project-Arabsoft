import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthenticateService } from '../../authenticate.service';
import { IDemand } from './idemand';
import { map } from 'rxjs/operators';
import { Demand } from 'src/app/models/works/demand';
@Injectable({
  providedIn: 'root',
})
export class DemandService {
  headers = {
    headers: new HttpHeaders({
      "Authorization": `Bearer ${this.authService.getToken}`,
      "Content-Type":"application/json"
    }),
  }
  private responseHeaders = {
    headers: new HttpHeaders({
      "Authorization": `Bearer ${this.authService.getToken}`,
      "Content-Type":"application/json"
    }),
    observe:"response"as "body",
  }
  private apiURL = 'http://127.0.0.1:8080/api/demands';

  constructor(
    private http: HttpClient,
    private authService: AuthenticateService

  ) {}

//Get all

  all(queryparams:string | undefined): Observable<HttpResponse<IDemand[]>> {
    let url:string=this.apiURL
    if (queryparams!==undefined) {
      url=url.concat("?".concat(queryparams))
    }
    return this.http.get<HttpResponse<IDemand[]>>(`${url}`,this.responseHeaders)
  }

  allByStatus( status:string,queryparams:string | undefined): Observable<HttpResponse<IDemand[]>>{
    let url:string=this.apiURL
    if (queryparams!==undefined) {
      queryparams=queryparams.replace("?","&")
      url=url.concat(queryparams)
    }
    return this.http.get<HttpResponse<IDemand[]>>(`${url}?status=${status}`,this.responseHeaders)
  }




  create(demande: Demand):Observable<Demand> {

    return this.http.post<Demand>(`${this.apiURL}`, JSON.stringify(demande), this.headers);
  }


update(id:string,demande: Demand) :Observable<Demand>{
console.log(JSON.stringify(demande))
  return this.http.put<Demand>(`${this.apiURL}/${id}`, JSON.stringify(demande), this.headers);
}

  findDemand(id: string): Observable<HttpResponse<IDemand>> {
    return this.http.get<HttpResponse<IDemand>>(`${this.apiURL}/${id}`, this.responseHeaders)
  }
  allByUser(id:string): Observable<IDemand[]> {

    return this.http.get<IDemand[]>(`${this.apiURL}/user/${id}`,this.headers).pipe(
      map((demandes: IDemand[]) => {
        return demandes.map((demandes) => ({
          id: demandes.id,
          title: demandes.title,
          description: demandes.description,
          address: demandes.address,
          createdAt: demandes.createdAt,
          status: demandes.status,
          user: demandes.user,

        }));
      })
    );
  }


}
