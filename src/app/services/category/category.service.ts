import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Category } from 'src/app/models/Category';
import { AuthenticateService } from '../authenticate.service';
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
    return this.http.get<ICategory[]>(`${this.apiURL}`).pipe(
      map((cat: ICategory[]) => {
        return cat.map((cat) => ({
          name: cat.name,
        }));
      })
    );
  }

  create(categorie: Category) {
    console.log(JSON.stringify(categorie));
    return this.http.post(`${this.apiURL}`,JSON.stringify(categorie),this.httpOptions);
  }
}
