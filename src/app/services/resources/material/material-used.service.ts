import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthenticateService } from '../../authenticate.service';
import { IMaterial } from './imaterial';
import { IMaterialUsed } from './imterialUsed';

@Injectable({
  providedIn: 'root',
})
export class MaterialUsedService {
  private apiURL = 'http://127.0.0.1:8080/api/materials';
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
  all(): Observable<IMaterialUsed[]> {
    return this.http
      .get<IMaterialUsed[]>(`${this.apiURL}`, this.httpOptions)
      .pipe(
        map((materials: IMaterialUsed[]) => {
          return materials.map((material) => ({
            id: material.id,
            name: material.name,
            description: material.description,
            totalQuantity: material.totalQuantity,
            dateOfPurchase: material.dateOfPurchase,
            status: material.status,
            address: material.address,
            quantityToUse: material.quantityToUse,
            dateOfUse: material.dateOfUse,
            category:material.category

          }));
        })
      );
  }


  findMaterial(id: string): Observable<IMaterialUsed> {
    return this.http
      .get<IMaterialUsed>(`${this.apiURL}/${id}`, this.httpOptions)
      .pipe(
        map((material: IMaterialUsed) => {
          return material;
        })
      );
  }
}
