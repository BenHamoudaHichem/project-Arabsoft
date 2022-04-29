import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from 'src/app/models/Contact';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  private apiURL = 'http://localhost:8080/api/services';
  constructor(private http: HttpClient) { }

  create(contact: Contact) {
    console.log( JSON.stringify(contact))
    return this.http.post(
      `${this.apiURL}/contact`,
      JSON.stringify(contact),
      httpOptions
    );
  }
}
