import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Material } from 'src/app/models/resources/Material';
import { AuthenticateService } from '../../authenticate.service';
import { IMaterial } from './imaterial';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private apiURL = 'http://127.0.0.1:8080/api/materials';
  private httpOptions = {
    headers: new HttpHeaders({
      "Authorization": `Bearer ${this.authService.getToken}`,
      'Content-Type': 'application/json',
    }),
  };
  constructor(
    private http: HttpClient,
    private authService: AuthenticateService
  ) {}
  all(): Observable<IMaterial[]> {
    return this.http.get<IMaterial[]>(`${this.apiURL}`,this.httpOptions).pipe(
      map((materials: IMaterial[]) => {
        return materials.map((material) => ({
          id: material.id,
          name: material.name,
          description: material.description,
          totalQuantity:material.totalQuantity,
          dateOfPurchase: material.dateOfPurchase,

          status: material.status,
          address: material.address,
        }));
      })
    );
  }
  allByStatus(status: string): Observable<IMaterial[]> {
    return this.http
      .get<IMaterial[]>(`${this.apiURL}?status=${status}`)
      .pipe(
        map((equipment: IMaterial[]) => {
          return equipment.map((equipment) => ({
            id: equipment.id,
            name: equipment.name,
            description: equipment.description,
            totalQuantity:equipment.totalQuantity,
            dateOfPurchase: equipment.dateOfPurchase,
            address: equipment.address,
            status: equipment.status,
          }));
        })
      );
  }

  create(equipment: Material) {
    console.log(JSON.stringify(equipment));

    return this.http.post(
      `${this.apiURL}`,
      JSON.stringify(equipment),
      this.httpOptions
    );
  }


  findMaterial(id: string): Observable<IMaterial> {
    return this.http
      .get<IMaterial>(`${this.apiURL}/${id}`, this.httpOptions)
      .pipe(
        map((material: IMaterial) => {
          return material;
        })
      );
  }


  update(id:string,material: Material) {


    return this.http.put(
      `${this.apiURL}/${id}`,
      JSON.stringify(material),
      this.httpOptions
    );
  }
}
