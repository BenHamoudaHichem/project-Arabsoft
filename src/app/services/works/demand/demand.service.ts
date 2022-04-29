import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  };
  private apiURL = 'http://127.0.0.1:8080/api/demands';

  constructor(
    private http: HttpClient,
    private authService: AuthenticateService

  ) {}

//Get all

  all(): Observable<IDemand[]> {
    return this.http.get<IDemand[]>(`${this.apiURL}`).pipe(
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

  allByStatus( status:string): Observable<IDemand[]> {
    return this.http.get<IDemand[]>(`${this.apiURL}?status=${status}`).pipe(
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




  create(demande: Demand) {

    return this.http.post(`${this.apiURL}`, JSON.stringify(demande), this.headers);
  }




  findDemand(id: string): Observable<IDemand> {
    return this.http
      .get<IDemand>(`${this.apiURL}/${id}`, this.headers)
      .pipe(
        map((demand: IDemand) => {
          return demand;
        })
      );
  }
  allByUser(id:string): Observable<IDemand[]> {
    return this.http.get<IDemand[]>(`${this.apiURL}/user/${id}`).pipe(
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
