import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InterventionClosed } from 'src/app/models/works/interventionClosed';
import { AuthenticateService } from '../../authenticate.service';
import { IInterventionClosed } from './iinterventionClosed';

@Injectable({
  providedIn: 'root',
})
export class interventionClosedService {
  headers = {
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken}`,
      'Content-Type': 'application/json',
    }),
  };
  private apiURL = 'http://127.0.0.1:8080/api/interventionsCloseds';

  constructor(
    private http: HttpClient,
    private authService: AuthenticateService
  ) {}
  all(): Observable<IInterventionClosed[]> {
    return this.http.get<IInterventionClosed[]>(`${this.apiURL}`).pipe(
      map((intervention: IInterventionClosed[]) => {
        return intervention.map((intervention) => ({
          id: intervention.id,
          title: intervention.title,
          description: intervention.description,
          category: intervention.category,
          address: intervention.address,
          startedAt: intervention.startedAt,
          status: intervention.status,
          demandList: intervention.demandList,
          team: intervention.team,
          createdAt: intervention.createdAt,
          expiredAt: intervention.expiredAt,

          materialsToBeUsed: intervention.materialsToBeUsed,

          closingComment: intervention.closingComment,
          closedDate: intervention.closedDate,
          materialUsedList:intervention.materialUsedList,
          workingGroup: intervention.workingGroup,
        }));
      })
    );
  }



  create(intervention: InterventionClosed): Observable<InterventionClosed> {
    console.log( JSON.stringify(intervention))
    return this.http.post<InterventionClosed>(
      `${this.apiURL}`,
      JSON.stringify(intervention),
      this.headers
    );
  }
  update(intervention: InterventionClosed, id: String): Observable<InterventionClosed> {
    return this.http.put<InterventionClosed>(
      `${this.apiURL}/${id}`,
      JSON.stringify(intervention),
      this.headers
    );
  }

  findById(id: string): Observable<IInterventionClosed> {
    return this.http
      .get<IInterventionClosed>(`${this.apiURL}/${id}`, this.headers)
      .pipe(
        map((intervention: IInterventionClosed) => {
          return intervention;
        })
      );
  }
}
