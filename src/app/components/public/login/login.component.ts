import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Notify, Report } from 'notiflix';
import { lastValueFrom, of } from 'rxjs';
import { AuthenticateService } from 'src/app/services/authenticate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(private formBuilder: FormBuilder,private authService : AuthenticateService,private router:Router) {
    this.loginForm = this.formBuilder.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    if(this.authService.isLogin)
    {
      this.router.navigate(['/dashboard/not-found'])
    }
  }

  try_login() {
    console.log(this.Identifier?.value, this.Password?.value);
     this.authService.login(this.Identifier?.value,this.Password?.value).subscribe((res:any)=>{

      if (!res.status) {


        this.authService.onLoginSucces(res.token,res.username,res.id,res.roles[0])
        let direction:string = "/dashboard/customer/home"
        if (this.authService.isMANAGER) {
          direction = "/dashboard/manager/home"

        }
        this.router.navigate([direction])
        Notify.success('Bienvenue '+res.username);
        return
      }



    }),(error: HttpErrorResponse) => {
      Report.warning(
        "Notification de connexion",error.message,"D'accord"
        )
    };
   // Report.warning('Echec','Veuillez verifier votre adresse ou mot de passe','OK');
  }

  get Identifier() {
    return this.loginForm.get('identifier');
  }
  get Password() {
    return this.loginForm.get('password');
  }

  getErrorMessage(key: any) {
    if (this.loginForm.controls[key].errors?.['required']) {
      return 'Vous devez saisir votre ' + key;
    }
    return 'Email mal saisie ';
  }
}
