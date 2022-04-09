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
  private apiURL = 'http://127.0.0.1:8080/api/users';

  constructor(
    private http: HttpClient,
    private authService: AuthenticateService
  ) { }
  all(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiURL}`).pipe(
      map((users: IUser[]) => {
        return users.map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          identifier: user.identifier,
          password: user.password,
          address: user.address,
          tel: user.tel,
roles:user.roles
      })
    );
  }))}


  allByRole(role:string): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiURL}?role=${role}`).pipe(
      map((users: IUser[]) => {
        return users.map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          identifier: user.identifier,
          password: user.password,
          address: user.address,
          tel: user.tel,
          roles:user.roles
      })
    );
  }))}



  create(user: User) {
    console.log( JSON.stringify(user))
    return this.http.post(
      `${this.apiURL}`,
      JSON.stringify(user),
      httpOptions
    );
  }


  getUser(id: string): Observable<IUser> {
    return this.http
      .get<IUser>(`${this.apiURL}/${id}`, httpOptions)
      .pipe(
        map((user: IUser) => {
          return user;
        })
      );
  }

  update(user: User,id:string) {
    let headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken}`,
        'Access-Control-Allow-Origin': '*',
      }),
    };

    return this.http.put(
      `${this.apiURL}/${id}`,
      JSON.stringify(user),
      headers
    );
  }
  agents(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiURL}?role=tm&role2=member`).pipe(
      map((users: IUser[]) => {
        return users.map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          identifier: user.identifier,
          password: user.password,
          address: user.address,
          tel: user.tel,
          roles:user.roles
      })
    );
  }))}
}
