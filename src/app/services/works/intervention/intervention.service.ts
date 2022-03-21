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
      Authorization: `Berear${this.authService.getToken()}`,
    }),
  };
  private apiURL = 'http://127.0.0.1:8080/gestintern';

  constructor(
    private http: HttpClient,
    private authService: AuthenticateService
  ) {}
  all(): Observable<IIntervention[]> {
    return this.http.get<IIntervention[]>(`${this.apiURL}/interventions`).pipe(
      map((intervention: IIntervention[]) => {
        return intervention.map((intervention) => ({
          id: intervention.id,
          title: intervention.title,
          description: intervention.description,
          createdAt: intervention.createdAt,
          startedAt: intervention.startedAt,
          status: intervention.status,
          category: intervention.category,
          materials:intervention.materials
        }));
      })
    );
  }
  create(intervention: Intervention): Observable<Intervention> {
    var d = JSON.stringify(intervention);
    console.log(d)
    return this.http.post<Intervention>(
      `${this.apiURL}/createIntervention`,
      d,
      this.headers
    );
  }

  showIntervention(id: string): Observable<IIntervention> {
    return this.http
      .get<IIntervention>(`${this.apiURL}/intervention/${id}`, this.headers)
      .pipe(
        map((intervention: IIntervention) => {
          return intervention;
        })
      );
  }


}
