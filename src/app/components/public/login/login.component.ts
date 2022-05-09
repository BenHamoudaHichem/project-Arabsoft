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
  hide: boolean = true;

  showFn() {
    this.hide = !this.hide;
  }
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticateService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      identifier: ['', [Validators.required]],
      password: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]{8,}$')],
      ],
      captcha: ['', [Validators.required]],
    });
    this.captcha?.setValue(false);
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
          Report.failure('Erreur', 'invalide login', 'OK');
        }
      }),
      (error: HttpErrorResponse) => {
        console.log(error.message);
        Report.warning(
          'Notification de connexion',
          'invalide login',
          "D'accord"
        );
      };
    //  Report.warning('Echec','Veuillez verifier votre adresse ou mot de passe','OK');
  }

  get Identifier() {
    return this.loginForm.get('identifier');
  }
  get Password() {
    return this.loginForm.get('password');
  }

  public get captcha() {
    return this.loginForm.get('captcha');
  }

  check() {
    Object.keys(this.loginForm.controls).forEach((key) => {
      if (this.loginForm.get(key)!.errors) {
        console.log(this.loginForm.get(key)!.errors);
        if (this.loginForm.get(key)!.errors!.hasOwnProperty('required')) {
          Report.failure(key, 'Champs obligatoire', "D'accord");
        }
        if (this.loginForm.get(key)!.errors!.hasOwnProperty('pattern')) {
          let stringAlpha: string = ' des lettres alphabétiques ';
          let stringdigit: string = ' des chiffres ';
          let stringMin: string = ' au minimum ';
          let stringMax: string = ' au maximum ';
          let stringOperation: string = String(
            this.loginForm.get(key)!.errors!['pattern'].requiredPattern
          );
          console.log(stringOperation);

          let res: string = '';
          if (stringOperation.indexOf('a-z') != -1) {
            res = 'Ce champs doit contenir';
            res = res + stringAlpha;
          }
          if (stringOperation.indexOf('0-9') != -1) {
            if (res.length == 0) {
              res = 'Ce champs doit contenir';
              res = res + stringdigit;
            } else {
              res = res + 'et' + stringdigit;
            }
          }

          if (stringOperation.includes('{')) {
            let min: number = Number(
              stringOperation.substring(
                stringOperation.indexOf('{') + 1,
                stringOperation.indexOf(',')
              )
            );
            res = res.concat('avec un taille de ' + min + stringMin);
            if (
              Number(
                stringOperation.substring(
                  stringOperation.indexOf(',') + 1,
                  stringOperation.indexOf('}')
                )
              ) !== 0
            ) {
              let max: number = Number(
                stringOperation.substring(
                  stringOperation.indexOf(',') + 1,
                  stringOperation.indexOf('}')
                )
              );
              res = res.concat('et de ' + max + stringMax);
            }
          }

          Report.failure(key, res, "D'accord");
        }
      }
    });
  }

  checkCaptcha(captchaResponse: string) {
    this.captcha?.setValue(
      captchaResponse && captchaResponse.length > 0 ? true : false
    );
    console.log(
      (this.captchaResolved =
        captchaResponse && captchaResponse.length > 0 ? true : false)
    );
  }
}
