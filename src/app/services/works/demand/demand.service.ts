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
  private apiURL = 'http://127.0.0.1:8080/gestintern';

  constructor(
    private http: HttpClient,
    private authService: AuthenticateService
  ) { }
  all(): Observable<IDemand[]> {
    return this.http.get<IDemand[]>(`${this.apiURL}/demandes`).pipe(
      map((demandes: IDemand[]) => {
        return demandes.map((demandes) => ({
          id: demandes.id,
          title: demandes.title,
          description: demandes.description,
          createdAt: demandes.createdAt,
          lieu: demandes.lieu,
          user: demandes.user,
          status: demandes.status,
        }));
      })
    );
  }
  create(demande: Demand) {
    var d = JSON.stringify(demande);
    return this.http.post(`${this.apiURL}/createDemande`, d, this.headers);
  }
}
