import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectGuard implements CanActivate {
  constructor(
    private authService: AuthenticateService,
    private _router: Router
  ) {}
  canActivate(): boolean {
    if (this.authService.isLogin && this.authService.isCustumer) {
      this._router.navigate(['/dashboard/customer/home']);
      return false;
    }

    if (this.authService.isLogin && this.authService.isMANAGER) {
      this._router.navigate(['/dashboard/manager/home']);
      return false;
    }
    return true;
  }
}
