import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  constructor(
    private http: HttpClient,
    private authService: AuthenticateService
  ) {}

  all(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.apiURL}`,this.httpOptions).pipe(
      map((cat: ICategory[]) => {
        return cat.map((cat) => ({
          id:cat.id,
          name: cat.name,
        }));
      })
    );
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
    materialList:int.materialList
        }));
      })
    );
  }

  create(categorie: Category) {
    console.log(JSON.stringify(categorie));
    return this.http.post(`${this.apiURL}`,JSON.stringify(categorie),this.httpOptions);
  }
}
