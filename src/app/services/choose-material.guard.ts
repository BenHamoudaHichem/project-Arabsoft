import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot, RoutesRecognized, UrlTree } from '@angular/router';
import { filter, Observable, pairwise } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChooseMaterialGuard implements CanActivate {
  public constructor(private router:Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.router.events.pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        console.log(events[0].urlAfterRedirects.includes("createIntervention"));
        if (!events[0].urlAfterRedirects.includes("createIntervention")) {
          this.router.navigate(['eff'])

        }
        return true
      })
    return true

  }


}
