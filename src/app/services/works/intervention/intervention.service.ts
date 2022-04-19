import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  private apiURL = 'http://127.0.0.1:8080/api/interventions';

  constructor(
    private http: HttpClient,
    private authService: AuthenticateService
  ) {}
  all(): Observable<IIntervention[]> {
    return this.http.get<IIntervention[]>(`${this.apiURL}`).pipe(
      map((intervention: IIntervention[]) => {
        return intervention.map((intervention) => ({
          id: intervention.id,
          title: intervention.title,
          description: intervention.description,
          category: intervention.category,
          address:intervention.address,
          startedAt: intervention.startedAt,
          status: intervention.status,
          demandList:intervention.demandList,
          team:intervention.team,
          createdAt: intervention.createdAt,
          materialList:intervention.materialList
        }));
      })
    );
  }


  interventionPerStatus(status:string): Observable<IIntervention[]> {
    return this.http.get<IIntervention[]>(`${this.apiURL}?status=${status}`).pipe(
      map((intervention: IIntervention[]) => {
        return intervention.map((intervention) => ({
    id: intervention.id,
    title: intervention.title,
    description: intervention.description,
    category: intervention.category,
    address:intervention.address,
    startedAt: intervention.startedAt,
    status: intervention.status,
    demandList:intervention.demandList,
    team:intervention.team,
    createdAt: intervention.createdAt,
    materialList:intervention.materialList
        }));
      })
    );
  }

  create(intervention: Intervention): Observable<Intervention> {

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

  showIntervention(id: string): Observable<IIntervention> {
    return this.http
      .get<IIntervention>(`${this.apiURL}/${id}`, this.headers)
      .pipe(
        map((intervention: IIntervention) => {
          return intervention;
        })
      );
  }


}
