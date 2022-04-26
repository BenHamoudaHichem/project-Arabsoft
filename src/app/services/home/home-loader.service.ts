import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthenticateService } from '../authenticate.service';
import { IHomeCustomer } from './ihome-customer';
import { IHomeManager } from './ihome-manager';

@Injectable({
  providedIn: 'root'
})
export class HomeLoaderService {
  private headers = {
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken}`,
      "Content-Type":"application/json",
    }),
  };
  private apiURL = 'http://127.0.0.1:8080/api/services/homeLoader';

  constructor(
    private http: HttpClient,
    private authService: AuthenticateService

  ) {}


  loadHomeForManager():Observable<IHomeManager>
  {
    
    return this.http.get<IHomeManager>(`${this.apiURL}/manager`,this.headers)
    .pipe(
      map((iHomeManager: IHomeManager) => {
        return iHomeManager;
      })
    )
  }
  loadHomeForCustomer():Observable<IHomeCustomer>
  {
    return this.http.get<IHomeCustomer>(`${this.apiURL}/customer`,this.headers)
    .pipe(
      map((iHomeManager: IHomeCustomer) => {
        return iHomeManager;
      })
    )
  }

}
