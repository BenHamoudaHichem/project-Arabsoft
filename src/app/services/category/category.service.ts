import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Category } from 'src/app/models/Category';
import { AuthenticateService } from '../authenticate.service';
import { IIntervention } from '../works/intervention/iintervention';
import { ICategory } from './icategory';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiURL = 'http://127.0.0.1:8080/api/categories';
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken}`,
      'Content-Type': 'application/json',
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

  all(): Observable<HttpResponse<ICategory[]>> {
    return this.http.get<HttpResponse<ICategory[]>>(`${this.apiURL}`,this.responseHeaders)
  }


  findInterventionsByCategory(id:string): Observable<IIntervention[]> {
    return this.http.get<IIntervention[]>(`${this.apiURL}/${id}/interventions`,this.httpOptions).pipe(
      map((int: IIntervention[]) => {
        return int.map((int) => ({
         id: int.id,
    title: int.title,
    description: int.description,
    category: int.category,
    address:int.address,
    startedAt: int.startedAt,
    status: int.status,
    demandList:int.demandList,
    team:int.team,
    createdAt: int.createdAt,
    expiredAt:int.expiredAt,
    materialsToBeUsed:int.materialsToBeUsed
        }));
      })
    );
  }

  create(categorie: Category) {
    console.log(JSON.stringify(categorie));
    return this.http.post(`${this.apiURL}`,JSON.stringify(categorie),this.httpOptions);
  }
}
