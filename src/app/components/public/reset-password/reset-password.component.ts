import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Report } from 'notiflix';
import { Observable } from 'rxjs';
import { CAPTCHA_KEY } from 'src/app/services/properties';
import { ResetService } from 'src/app/services/reset.service';
import { UserService } from 'src/app/services/user/user.service';
import { Confirmed } from 'src/app/services/validation/Confirmed';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public captchaResolved: boolean = false;
  siteKey = CAPTCHA_KEY;
  resetPassword!:FormGroup
  hide: boolean = true;

  showFn() {
    this.hide = !this.hide;
  }
  constructor(
    private formBuilder: FormBuilder,private resetService:ResetService, private route: ActivatedRoute,private router:Router
  ) {
    this.resetPassword = this.formBuilder.group(
      {
        confirm_new_password: [
          '',
          [Validators.required, Validators.pattern('^[A-zÀ-ú0-9 ]{8,}$')],
        ],
        new_password: [
          '',
          [Validators.required, Validators.pattern('^[A-zÀ-ú0-9 ]{8,}$')],
        ],
    captcha: ['', [Validators.required]],
      },
      {validators:Confirmed.ConfirmedValidator("new_password","confirm_new_password")}

    );
  }
  ngOnInit(): void {
  }

  resetPass(){
//this.router.navigate(['/resetPassword'])
console.log(this.resetPassword.value)
this.resetService.reset(this.route.snapshot.paramMap.get("token")!,String(this.new_password?.value)).subscribe((res:any)=>{
console.log(res);

  if (res.status==true) {
    Report.info(
      'Nouvelle mot de passe',
      res.message+' <br/><br/>- ArabIntervent',
      "D'accord",
      );
      this.router.navigate(['/login'])

  }

})
 }
  checkCaptcha(captchaResponse: string) {
    console.log(
      (this.captchaResolved =
        captchaResponse && captchaResponse.length > 0 ? true : false)
    );
  }

  get confirm_new_password() {
    return this.resetPassword.get('confirm_new_password');
  }

  get new_password() {
    return this.resetPassword.get('new_password');
  }


  check() {
    Object.keys(this.resetPassword.controls).forEach((key) => {
      if (this.resetPassword.get(key)!.errors) {
        console.log(this.resetPassword.get(key)!.errors);
        if (
          this.resetPassword.get(key)!.errors!.hasOwnProperty('required')
        ) {
          Report.failure(key, 'Champs obligatoire', "D'accord");
        }
        if (
          this.resetPassword.get(key)!.errors!.hasOwnProperty('pattern')
        ) {
          let stringAlpha: string = ' des lettres alphabétiques ';
          let stringdigit: string = ' des chiffres ';
          let stringMin: string = ' au minimum ';
          let stringMax: string = ' au maximum ';
          let stringOperation: string = String(
            this.resetPassword.get(key)!.errors!['pattern'].requiredPattern
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

  }
