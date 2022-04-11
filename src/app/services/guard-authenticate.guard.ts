import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import * as Notiflix from 'notiflix';
import { Observable } from 'rxjs';
import { AuthenticateService } from './authenticate.service';
import { CookiesService } from './cookies.service';

@Injectable({
  providedIn: 'root',
}) /* constructor(private authService: AuthenticateService,private cookies:CookiesService, private router: Router){}
canActivate(
) {
if(this.authService.isLogin){
this.cookies.getRole.includes*/
export class GuardAuthenticateGuard implements CanActivate {
  constructor(
    private authService: AuthenticateService,
    private cookies: CookiesService,
    private _router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot):boolean {

    if (this.authService.isLogin) {
      return this.cookies.getRole.includes(route.data['role']);

    }
    console.log('not loging');
    this._router.navigate(['/login']);
    return false;

  }
}
