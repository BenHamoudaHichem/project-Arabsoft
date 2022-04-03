import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Team } from 'src/app/models/resources/team';
import { AuthenticateService } from '../../authenticate.service';
import { ITeam } from './iteam';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private apiURL = 'http://127.0.0.1:8080/api/teams';

  constructor(
    private http: HttpClient,
    private authService: AuthenticateService
  ) {}
  all(): Observable<ITeam[]> {
    return this.http.get<ITeam[]>(`${this.apiURL}`).pipe(
      map((team: ITeam[]) => {
        return team.map((team) => ({
          id: team.id,
          name: team.name,
          manager: team.manager,
          members: team.members,
        }));
      })
    );
  }

  getTeam(id: string): Observable<ITeam> {
    return this.http.get<ITeam>(`${this.apiURL}/${id}`, httpOptions).pipe(
      map((demand: ITeam) => {
        return demand;
      })
    );
  }
  create(team: Team) {
    return this.http.post(
      `${this.apiURL}`,
      JSON.stringify(team),
      httpOptions
    );
  }
  getName(name: string) {
    return this.http.get<ITeam[]>(`${this.apiURL}/${name}`);
  }
  update(team: Team,id:string) {
    let headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken}`,
        'Access-Control-Allow-Origin': '*',
      }),
    };

    return this.http.post(
      `${this.apiURL}/${id}`,
      JSON.stringify(team),
      headers
    );
  }
}
