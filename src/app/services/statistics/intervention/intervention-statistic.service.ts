import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthenticateService } from '../../authenticate.service';
import { Associatif } from '../../types/associatif';

@Injectable({
  providedIn: 'root'
})
export class InterventionStatisticService {
  private headers = {
    headers: new HttpHeaders({
      "Authorization": `Bearer ${this.authService.getToken}`,
      "Content-Type":"application/json"
    }),
  };
  private apiURL = 'http://127.0.0.1:8080/api/services/stats/intervention';

  constructor(private http: HttpClient,private authService: AuthenticateService) { }
  public get getPieCategories():Observable<Associatif[]>{
    return this.http.get<Associatif[]>(`http://127.0.0.1:8080/api/services/stats/categories/pie`,this.headers).pipe(
      map((interventions: Associatif[]) => {
        return interventions.map((intervention) => ({
          key:intervention.key,
          value: intervention.value,
        }));
      })
    );
}
}
