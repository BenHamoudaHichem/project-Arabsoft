import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Material } from 'src/app/models/resources/Material';
import { AuthenticateService } from '../../authenticate.service';
import { IMaterial } from './imaterial';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private apiURL = 'http://127.0.0.1:8080/api/materials';

  constructor(
    private http: HttpClient,
    private authService: AuthenticateService
  ) {}
  all(): Observable<IMaterial[]> {
    return this.http.get<IMaterial[]>(`${this.apiURL}`).pipe(
      map((equipment: IMaterial[]) => {
        return equipment.map((equipment) => ({
          id: equipment.id,
          name: equipment.name,
          description: equipment.description,
          dateOfPurshase: equipment.dateOfPurshase,
          address: equipment.address,
          status: equipment.status,
        }));
      })
    );
  }
  materialPerStatus(status: string): Observable<IMaterial[]> {
    return this.http
      .get<IMaterial[]>(`${this.apiURL}?status=${status}`)
      .pipe(
        map((equipment: IMaterial[]) => {
          return equipment.map((equipment) => ({
            id: equipment.id,
            name: equipment.name,
            description: equipment.description,
            dateOfPurshase: equipment.dateOfPurshase,
            address: equipment.address,
            status: equipment.status,
          }));
        })
      );
  }
  materialStatusOn(): Observable<IMaterial[]> {
    return this.http
      .get<IMaterial[]>(`${this.apiURL}?status=DISPONIBLE`)
      .pipe(
        map((equipment: IMaterial[]) => {
          return equipment.map((equipment) => ({
            id: equipment.id,
            name: equipment.name,
            description: equipment.description,
            dateOfPurshase: equipment.dateOfPurshase,
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
      httpOptions
    );
  }


  showMaterial(id: string): Observable<IMaterial> {
    return this.http
      .get<IMaterial>(`${this.apiURL}/${id}`, httpOptions)
      .pipe(
        map((material: IMaterial) => {
          return material;
        })
      );
  }


  update(id:string,material: Material) {
    let headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken}`,
        'Access-Control-Allow-Origin': '*',
      }),
    };

    return this.http.put(
      `${this.apiURL}/${id}`,
      JSON.stringify(material),
      headers
    );
  }
}
