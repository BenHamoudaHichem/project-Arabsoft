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
  private apiURL = 'http://127.0.0.1:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthenticateService
  ) {}
  all(): Observable<IMaterial[]> {
    return this.http.get<IMaterial[]>(`${this.apiURL}/materials`).pipe(
      map((equipment: IMaterial[]) => {
        return equipment.map((equipment) => ({
          id: equipment.id,
          name: equipment.name,
          description: equipment.description,
          dateOfPurshase: equipment.dateOfPurshase,
          location: equipment.location,
          status: equipment.status,
        }));
      })
    );
  }
  materialPerStatus(status: string): Observable<IMaterial[]> {
    return this.http
      .get<IMaterial[]>(`${this.apiURL}/materials/${status}`)
      .pipe(
        map((equipment: IMaterial[]) => {
          return equipment.map((equipment) => ({
            id: equipment.id,
            name: equipment.name,
            description: equipment.description,
            dateOfPurshase: equipment.dateOfPurshase,
            location: equipment.location,
            status: equipment.status,
          }));
        })
      );
  }
  create(equipment: Material) {
    console.log(JSON.stringify(equipment));

    return this.http.post(
      `${this.apiURL}/addMaterial`,
      JSON.stringify(equipment),
      httpOptions
    );
  }
  getName(id: string) {
    return this.http.get<Material[]>(`${this.apiURL}/material/${id}`);
  }

  showMaterial(id: string): Observable<IMaterial> {
    return this.http
      .get<IMaterial>(`${this.apiURL}/material/${id}`, httpOptions)
      .pipe(
        map((material: IMaterial) => {
          return material;
        })
      );
  }

  update(material: Material) {
    let headers = {
      headers: new HttpHeaders({
        Authorization: `Berear${this.authService.getToken()}`,
        'Access-Control-Allow-Origin': '*',
      }),
    };

    return this.http.post(
      `${this.apiURL}/material?_method=PUT`,
      JSON.stringify(material),
      headers
    );
  }
}
