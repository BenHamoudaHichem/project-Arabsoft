import { Injectable, Injector } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AESEncoderService } from './aesencoder.service';

@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  public static ROLE_CUSTOMER: string = 'ROLE_CUSTOMER';
  public static ROLE_MANAGER: string = 'ROLE_MANAGER';
  constructor(private myCookies: CookieService,private aesEncodeService:AESEncoderService) {
    try {
      this.getIdentifier;
    } catch (error) {
      console.log('error get identifier');
    }
  }

  createToken(token: string): void {
    this.myCookies.set('_token', this.aesEncodeService.encode(token));
  }
  get getToken(): string {
    return this.aesEncodeService.decode(this.myCookies.get('_token'));
  }

  get getIdentifier(): string {
    return this.aesEncodeService.decode(this.myCookies.get('_id'))
  }
  get getUsername(): string {
    return this.aesEncodeService.decode(this.myCookies.get('_username'));
  }

  get getRole(): string {
    return this.aesEncodeService.decode(this.myCookies.get('_role'));
  }

  addUserRole(role: string): void {
    this.myCookies.set('_role', this.aesEncodeService.encode(role));
  }

  addUsername(name: string): void {
    this.myCookies.set('_username', this.aesEncodeService.encode(name));
  }
  addUserId(id: string): void {
    this.myCookies.set('_id', this.aesEncodeService.encode(id));
  }
  deleteAll() {


    console.log(document.cookie)

    this.myCookies.deleteAll('/', 'localhost',false, 'Lax');
    this.myCookies.deleteAll('/dashboard/manager', 'localhost', false, 'Lax');
    this.myCookies.deleteAll('/dashboard/customer', 'localhost', false, 'Lax');
    
  }
  static init() {}
}
