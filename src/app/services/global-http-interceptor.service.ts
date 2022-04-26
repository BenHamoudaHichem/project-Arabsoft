import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Report } from 'notiflix';
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
          if (error.status==401) {
            console.log(this.authService.isMANAGER+" tttttttttttttt")
            Report.warning("Alert de sécurité","Vous dever reconnecter !","D'accord")

            this.authService.redirectIfNotAuth()
          }}
        //console.error(error);
        return of(error);
      })
    )
  }
 
}
