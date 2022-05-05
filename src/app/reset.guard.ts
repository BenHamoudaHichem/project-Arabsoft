import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ResetService } from './services/reset.service';

@Injectable({
  providedIn: 'root'
})
export class ResetGuard implements CanActivate {
  constructor(private resetService:ResetService, private route: ActivatedRoute,private router:Router
    ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.route.snapshot.paramMap.has("token")){
        return false
      }
    this.resetService.check(this.route.snapshot.paramMap.get("token")!).subscribe((res:any)=>{
      if (res.status==false) {

        console.log(res);

        //this.router.navigate(['not-found'])
        return false
      }
      else{return true}
    })
    return true;
  }

}
