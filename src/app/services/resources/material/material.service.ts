import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
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
  private headers = {
    headers: new HttpHeaders({
      "Authorization": `Bearer ${this.authService.getToken}`,
      "Content-Type":"application/json"
    }),
  };
  private headersFile = {
    headers: new HttpHeaders({
      "Authorization": `Bearer ${this.authService.getToken}`,
     // "Content-Type":"multipart/form-data",
      "reportProgress": "true",
      "responseType": 'json'
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

  all(queryparams:string | undefined): Observable<HttpResponse<IMaterial[]>> {

    let url:string=this.apiURL
    if (queryparams!==undefined) {
      url=url.concat('?'.concat(queryparams))
    }

    return (this.http.get<HttpResponse<IMaterial[]>>(`${url}`,this.responseHeaders))
  }
  allByStatus(status: string): Observable<IMaterial[]> {
    return this.http
      .get<IMaterial[]>(`${this.apiURL}?status=${status}`,this.headers)
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
            category:equipment.category

          }));
        })
      );
  }

  create(equipment: Material) {
    console.log(JSON.stringify(equipment));

    return this.http.post(
      `${this.apiURL}`,
      JSON.stringify(equipment),this.headers
    );
  }


  findMaterial(id: string): Observable<HttpResponse<IMaterial>> {
    return this.http.get<HttpResponse<IMaterial>>(`${this.apiURL}/${id}`,this.responseHeaders)
  }


  update(id:string,material: Material) {


    return this.http.put(
      `${this.apiURL}/${id}`,
      JSON.stringify(material),this.headers
    );
  }
  createFile(fd:FormData)
  {
    return this.http.post(`${this.apiURL}/file`,fd,this.headersFile)
  }
}
