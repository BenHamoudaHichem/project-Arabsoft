import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
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
  private headers = {
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken}`,
      "Content-Type":"application/json",
    }),
  };
  private responseHeaders = {
    headers: new HttpHeaders({
      "Authorization": `Bearer ${this.authService.getToken}`,
      "Content-Type":"application/json"
    }),
    observe:"response"as "body",
  };

  constructor(
    private http: HttpClient,
    private authService: AuthenticateService
  ) {}
  all(queryparams:string | undefined): Observable<HttpResponse<ITeam[]>> {
    let url:string=this.apiURL
    if (queryparams!==undefined) {
      url=url.concat('?'.concat(queryparams))
    }
    return this.http.get<HttpResponse<ITeam[]>>(`${url}`,this.responseHeaders)
  }
  allByStatus(status:string): Observable<HttpResponse<ITeam[]>>{
    return this.http.get<HttpResponse<ITeam[]>>(`${this.apiURL}?status=${status}`,this.responseHeaders)
  }

  findTeam(id: string): Observable<HttpResponse<ITeam>> {
    return this.http.get<HttpResponse<ITeam>>(`${this.apiURL}/${id}`, this.responseHeaders)
  }

  create(team:Team) {
    return this.http.post(`${this.apiURL}`,JSON.stringify(team),this.headers);
  }

  update(id:string,team: Team) {


    return this.http.put(
      `${this.apiURL}/${id}`,
      JSON.stringify(team),
      this.headers
    );
  }
}
