/*import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Notiflix, { Notify, Report } from 'notiflix';
import { catchError, Observable, of, throwError } from 'rxjs';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalHttpInterceptorService implements HttpInterceptor {

  constructor(private router:Router,private authService:AuthenticateService) { }

  //1.  No Errors
  intercept1(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error:any) => {
        console.log('error in intercept')
        //console.error(error);
        return throwError(error.message);
      })
    )
  }

  //2. Sending an Invalid Token will generate error
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token: string = 'invald token';
   // req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });

    return next.handle(req).pipe(
      catchError((error) => {
        console.log('error in intercept')
        if (error instanceof HttpErrorResponse) {
          if (error.status===401) {
           this.authService.redirectIfNotAuth()
            Report.warning("Alert de sécurité","Vous dever reconnecter !","D'accord")
          }
          if (error.status===400) {
             Report.warning("Alert de sécurité","Vous dever fffff !","D'accord")
           }
          if (error.status===500) {
             Notify.failure("problème au niveau du serveur !")
           }
        }

        //console.error(error);
        return of(error);
      })
    )
  }

}
*/
