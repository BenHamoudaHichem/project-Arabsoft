import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthenticateService } from '../authenticate.service';
import { ICategory } from './icategory';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiURL = 'http://127.0.0.1:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthenticateService
  ) {}

  all(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.apiURL}/categories`).pipe(
      map((cat: ICategory[]) => {
        return cat.map((cat) => ({
          eCategory: cat.eCategory,
        }));
      })
    );
  }
}
