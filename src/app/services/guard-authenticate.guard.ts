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
    private router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.getUsername;
    if (currentUser) {
        if (route.data['roles'] && route.data['roles'].indexOf(this.cookies.getRole) === -1) {
            this.router.navigate(['/dashboard/not-found']);
            return false;
        }

        return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false
}
}
