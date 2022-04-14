import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiURL = 'http://127.0.0.1:8080/api/services/states';
  private headers = {
    headers: new HttpHeaders({
      "Content-Type":"application/json"
    }),
  };
  constructor(private http: HttpClient) {

   }
   /**
    * get allTNStates
    */
   public get allTNStates():Observable<string[]> {

    return this.http.get<string[]>(this.apiURL,this.headers)
   }
      /**
    * allTNCitiesByState
    * @param state
    */
       public allTNCitiesByState(state:string):Observable<string[]> {

        return this.http.get<string[]>(`${this.apiURL}/${state}`,this.headers)
        
       }


}
