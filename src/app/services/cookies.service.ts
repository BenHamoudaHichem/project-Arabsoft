import { Injectable, Injector } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  public static ROLE_CUSTOMER: string = 'ROLE_CUSTOMER';
  public static ROLE_MANAGER: string = 'ROLE_MANAGER';
  constructor(private myCookies: CookieService) {
    try {
      this.getIdentifier;
    } catch (error) {
      console.log('error get identifier');
    }
  }

  createToken(token: string): void {
    this.myCookies.set('_token', token);
  }
  get getToken(): string {
    return this.myCookies.get('_token');
  }

  get TranslateLanguage(): string {
    return this.myCookies.get('_lang');
  }

  get getIdentifier(): string {
    return this.myCookies.get('_id');
  }
  get getUsername(): string {
    return this.myCookies.get('_username');
  }

  get getRole(): string {
    return this.myCookies.get('_role');
  }

  addUserRole(role: string): void {
    this.myCookies.set('_role', role);
  }
  addTranslateLanguage(lang: string): void {
    this.myCookies.set('_lang', lang);
  }
  addUsername(name: string): void {
    this.myCookies.set('_username', name);
  }
  addUserId(id: string): void {
    this.myCookies.set('_id', id);
  }
  deleteAll() {
    this.myCookies.deleteAll('/', 'localhost', false, 'Lax');
  }
  static init() {}
}
