import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Notify, Report } from 'notiflix';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { HTMLEscape } from 'src/app/services/validation/HTMLEscapeChars';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public captchaResolved: boolean = false;
  siteKey = '6LcOuyYTAAAAAHTjFuqhA52fmfJ_j5iFk5PsfXaU';
  loginForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticateService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required]],
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
    console.log(
      HTMLEscape.escapeMethod(this.Identifier?.value),
      this.Password?.value
    );
    this.authService
      .login(
        HTMLEscape.escapeMethod(this.Identifier?.value),
        HTMLEscape.escapeMethod(this.Password?.value)
      )
      .subscribe((res: any) => {
        if (!res.status) {
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
          Report.failure('Erreur', res.status, 'OK');
        }
      }),
      (error: HttpErrorResponse) => {
        Report.warning('Notification de connexion', error.message, "D'accord");
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


  getErrorMessage(key: any) {
    if (this.loginForm.controls[key].errors?.['required']) {
      return 'Vous devez saisir votre ' + key;
    }
    return 'Email mal saisie ';
  }

  checkCaptcha(captchaResponse: string) {
    this.captcha?.setValue(captchaResponse && captchaResponse.length > 0 ? true : false)
    console.log(
      (this.captchaResolved =
        captchaResponse && captchaResponse.length > 0 ? true : false)
    );
  }
}
