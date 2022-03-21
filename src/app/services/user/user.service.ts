import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthenticateService } from '../authenticate.service';
import { IUser } from './iuser';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiURL = 'http://127.0.0.1:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthenticateService
  ) { }
  all(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiURL}/users`).pipe(
      map((users: IUser[]) => {
        return users.map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastNamme: user.lastNamme,
          password: user.password,
          identifier: user.identifier,
          tel: user.tel,
          adresse: user.adresse,
        }));
      })
    );
  }
  create(user: User) {
    console.log( JSON.stringify(user))
    return this.http.post(
      `${this.apiURL}/register`,
      JSON.stringify(user),
      httpOptions
    );
  }
  getName(id: number) {
    return this.http.get<User[]>(`${this.apiURL}/username/${id}`);
  }
  update(user: User) {
    let headers = {
      headers: new HttpHeaders({
        Authorization: `Berear${this.authService.getToken()}`,
        'Access-Control-Allow-Origin': '*',
      }),
    };

    return this.http.post(
      `${this.apiURL}/user?_method=PUT`,
      JSON.stringify(user),
      headers
    );
  }
}
