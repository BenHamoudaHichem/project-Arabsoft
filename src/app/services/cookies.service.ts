import { Injectable, Injector } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AESEncoderService } from './aesencoder.service';

@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  public static ROLE_CUSTOMER: string = 'ROLE_CUSTOMER';
  public static ROLE_MANAGER: string = 'ROLE_MANAGER';
  private dateEx!:Date
  constructor(private myCookies: CookieService,private aesEncodeService:AESEncoderService) {

    this.dateEx=new Date()
    this.dateEx.setMinutes(new Date().getMinutes()+30)


  }

  createToken(token: string): void {
    this.myCookies.set('_token', this.aesEncodeService.encode(token),this.dateEx);
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
    this.myCookies.set('_role', this.aesEncodeService.encode(role),this.dateEx);
  }

  addUsername(name: string): void {
    this.myCookies.set('_username', this.aesEncodeService.encode(name),this.dateEx);
  }
  addUserId(id: string): void {
    this.myCookies.set('_id', this.aesEncodeService.encode(id),this.dateEx);
  }
  deleteAll() {
    this.myCookies.deleteAll('/', 'localhost',false, 'Lax');
    this.myCookies.deleteAll('/dashboard/manager', 'localhost', false, 'Lax');
    this.myCookies.deleteAll('/dashboard/customer', 'localhost', false, 'Lax');

  }
  static init() {}
}
