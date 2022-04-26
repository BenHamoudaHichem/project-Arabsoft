import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Notify, Report } from 'notiflix';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { HTMLEscape } from 'src/app/services/validation/HTMLEscapeChars';
import { CAPTCHA_KEY } from 'src/app/services/properties';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public captchaResolved: boolean = false;
  siteKey = CAPTCHA_KEY;
  loginForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticateService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]{8,}$')]],
      captcha: ['', [Validators.required]],
    });
    this.captcha?.setValue(false)
  }
  ngOnInit(): void {
    if (this.authService.isLogin) {
      this.router.navigate(['/dashboard/not-found']);
    }
  }

  try_login() {

    this.authService
      .login(
        HTMLEscape.escapeMethod(this.Identifier?.value),
        HTMLEscape.escapeMethod(this.Password?.value)
      )
      .subscribe((res: any) => {
        if (res.token) {
          this.authService.onLoginSucces(
            res.token,
            res.username,
            res.id,
            res.roles[0]
          );
          
          let direction: string = '/dashboard/customer/home';
          if (this.authService.isMANAGER) {
            direction = '/dashboard/manager/home';
          }
          this.router.navigate([direction]);
          Notify.success('Bienvenue ' + res.username);
          return;
        } else {
          Report.failure('Erreur', "invalide login", 'OK');
        }
      }),
      (error: HttpErrorResponse) => {
        console.log(error.message)
        Report.warning('Notification de connexion', "invalide login", "D'accord");
      };
    //  Report.warning('Echec','Veuillez verifier votre adresse ou mot de passe','OK');
  }

  get Identifier() {
    return this.loginForm.get('identifier');
  }
  get Password() {
    return this.loginForm.get('password');
  }

  public get captcha()  {
    return this.loginForm.get('captcha');
  }




  checkCaptcha(captchaResponse: string) {
    this.captcha?.setValue(captchaResponse && captchaResponse.length > 0 ? true : false)
    console.log(
      (this.captchaResolved =
        captchaResponse && captchaResponse.length > 0 ? true : false)
    );
  }
}
