import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthenticateService } from '../../authenticate.service';
import { Associatif } from '../../types/associatif';
import { IDemandPerYear } from './idemand-per-year';

@Injectable({
  providedIn: 'root'
})
export class DemandStatisticService {
  private headers = {
    headers: new HttpHeaders({
      "Authorization": `Bearer ${this.authService.getToken}`,
      "Content-Type":"application/json"
    }),
  };
  private apiURL = 'http://127.0.0.1:8080/api/services/stats/demands';

  constructor(
    private http: HttpClient,
    private authService: AuthenticateService

  ) {}
  public get getDemandsPerYear():Observable<IDemandPerYear[]>
  {

    return this.http.get<IDemandPerYear[]>(`${this.apiURL}`).pipe(
      map((demand: IDemandPerYear[]) => {
        return demand.map((demand) => ({
          month:demand.month,
          sum: demand.sum,
        }));
      })
    );
  }
}
