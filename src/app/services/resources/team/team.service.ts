import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Team } from 'src/app/models/resources/team';
import { AuthenticateService } from '../../authenticate.service';
import { ITeam } from './iteam';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private apiURL = 'http://127.0.0.1:8080/api/teams';
  private httpOptions = {
    headers: new HttpHeaders({
      "Authorization": `Bearer ${this.authService.getToken}`,
      'Content-Type': 'application/json',
    }),
  };

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
  findByStatus(status:string): Observable<ITeam[]> {
    return this.http.get<ITeam[]>(`${this.apiURL}?status=${status}`).pipe(
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
    return this.http.get<ITeam>(`${this.apiURL}/${id}`, this.httpOptions).pipe(
      map((demand: ITeam) => {
        return demand;
      })
    );
  }

  create(team: Team) {
    return this.http.post(
      `${this.apiURL}`,
      JSON.stringify(team),
      this.httpOptions
    );
  }

  update(id:string,team: Team) {


    return this.http.put(
      `${this.apiURL}/${id}`,
      JSON.stringify(team),
      this.httpOptions
    );
  }
}
