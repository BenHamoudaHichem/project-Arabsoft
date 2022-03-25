import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Report } from 'notiflix';
import { Observable } from 'rxjs';
import { CookiesService } from './cookies.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  private apiURL = 'http://127.0.0.1:8000';
  constructor(private http: HttpClient, private router: Router,private cookies:CookiesService) {}

  getAuthenticatedUser() {
    let headers = {headers: new HttpHeaders({
        Authorization: `Berear${this.getToken()}`,
      }),
    };
    return this.http.get(`${this.apiURL}/user`, headers);
  }



  public  login(email: string, password: string) {

    return  this.http.post(`${this.apiURL}/login`,{ identifier: email, password: password },httpOptions)
  }

  logout() {
    let token = this.getToken();
    this.removeToken();

    return this.http.post(
      `${this.apiURL}/logout`,
      { token: token },
      httpOptions
    );
  }

  get userByToken(): number {
    let infos: any;
    try {
      infos = jwtDecode(this.getToken());
      return Number(infos.sub);
    } catch (error) {
      return 0;
    }
  }

  get isLogin(): boolean {
    return this.getToken() !== null;
  }
  //Token service
  getToken() {
    return this.cookies.getToken!;
  }
  // Verify the token
  isValidToken() {
    const token = this.getToken();

    if (token) {
      this.getAuthenticatedUser().subscribe(
        (res: any) => {
          if (!res.user) {
            this.redirectIfNotAuth();
          }
        },
        (error) => {
          this.redirectIfNotAuth();
        }
      );
    }
  }

  get getUsername():string{

    return this.cookies.getUsername
  }

  onLoginSucces(token:string,username:string,id:string,role:string)
  {
    this.cookies.createToken(token)
    this.cookies.addUserId(id)
    this.cookies.addUserRole(role)
    this.cookies.addUsername(username)
  }

  removeToken() {
    this.cookies.deleteAll()
  }

  redirectIfNotAuth() {
    Report.warning("Connexion perdu",'Vous devez reconnecter Session expirée',"Je compris");
    this.removeToken();
    this.router.navigate(['/login']);
  }
}
