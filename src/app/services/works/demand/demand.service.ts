import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
      Authorization: `Berear${this.authService.getToken()}`,
    }),
  };
  private apiURL = 'http://127.0.0.1:8080';

  constructor(
    private http: HttpClient,
    private authService: AuthenticateService
  ) {}

//Get all

  all(): Observable<IDemand[]> {
    return this.http.get<IDemand[]>(`${this.apiURL}/demandes`).pipe(
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
  //Get all by status

  allByStatus( status:string): Observable<IDemand[]> {
    return this.http.get<IDemand[]>(`${this.apiURL}/demandes?status=${status}`).pipe(
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


//Create demand

  create(demande: Demand) {
    var d = JSON.stringify(demande);
    console.log(d);
    return this.http.post(`${this.apiURL}/createDemande`, d, this.headers);
  }


  //Show demand

  showDemande(id: string): Observable<IDemand> {
    return this.http
      .get<IDemand>(`${this.apiURL}/demande/${id}`, this.headers)
      .pipe(
        map((demand: IDemand) => {
          return demand;
        })
      );
  }
}
