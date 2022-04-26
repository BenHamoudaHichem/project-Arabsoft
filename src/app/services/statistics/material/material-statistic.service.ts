import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthenticateService } from '../../authenticate.service';
import { Associatif } from '../../types/associatif';

@Injectable({
  providedIn: 'root'
})
export class MaterialStatisticService {
  private headers = {
    headers: new HttpHeaders({
      "Authorization": `Bearer ${this.authService.getToken}`,
      "Content-Type":"application/json"
    }),
  };
  private apiURL = 'http://127.0.0.1:8080/api/services/stats/materials';

  constructor(private http: HttpClient,private authService: AuthenticateService) { }
  public get getPieStatus():Observable<Associatif[]>{
    return this.http.get<Associatif[]>(`${this.apiURL}/pie`,this.headers).pipe(
      map((teams: Associatif[]) => {
        return teams.map((team:any) => ({
          key:team.key,
          value: team.value,
        }));
      })
    );
}
}
