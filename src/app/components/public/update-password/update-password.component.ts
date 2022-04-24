import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Report } from 'notiflix';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { UserService } from 'src/app/services/user/user.service';
import { Confirmed } from 'src/app/services/validation/Confirmed';
import { CAPTCHA_KEY } from 'src/app/services/properties';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css'],
})
export class UpdatePasswordComponent implements OnInit {
  public captchaResolved: boolean = false;
  siteKey = CAPTCHA_KEY;
  formUpdatePassword!: FormGroup;
  constructor(private formBuilder: FormBuilder,private userService:UserService,private AuthenticateService:AuthenticateService) {
    this.formUpdatePassword = this.formBuilder.group(
      {
        confirm_new_password: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]{8,}$')],
        ],
        new_password: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]{8,}$')],
        ],
        old_password: ['', [Validators.required]],
        captcha: ['', [Validators.required]],
      },
      {
        Validators: Confirmed.ConfirmedValidator(
          'new_password',
          'confirm_new_password'
        ),
      }
    );
  }

  ngOnInit(): void {}

  checkCaptcha(captchaResponse: string) {
    console.log(
      (this.captchaResolved =
        captchaResponse && captchaResponse.length > 0 ? true : false)
    );
  }

  changePassword()
  {
    let passwordRequest:any={id:this.AuthenticateService.authentificatorId,oldPassword:String(this.old_password?.value),newPassword:String(this.new_password?.value)}

    this.userService.changePassword(passwordRequest).subscribe((res:any)=>{
      if (res.status==true) {

        Report.success("Changer Mot de passe", res.message,"D'accord")
      } else {

        Report.failure("Changer Mot de passe", res.message,"D'accord")

      }
    }),
    (error: HttpErrorResponse) => {
      if(error.status==401){
        this.AuthenticateService.redirectIfNotAuth()

      }else{
        Report.failure('Erreur', error.message,'OK')
      }
      }
  }




  get confirm_new_password() {
    return this.formUpdatePassword.get('confirm_new_password');
  }
  get old_password() {
    return this.formUpdatePassword.get('old_password');
  }
  get new_password() {
    return this.formUpdatePassword.get('new_password');
  }


  check()
  {
   Object.keys(this.formUpdatePassword.controls).forEach(key => {
     if (this.formUpdatePassword.get(key)!.errors) {
     console.log(this.formUpdatePassword.get(key)!.errors)
      if(this.formUpdatePassword.get(key)!.errors!.hasOwnProperty('required'))
      {
        Report.failure(key,"Champs obligatoire","D'accord")
      }
      if(this.formUpdatePassword.get(key)!.errors!.hasOwnProperty('pattern'))
      {
        let stringAlpha:string=" des lettres alphabétiques "
        let stringdigit:string=" des chiffres "
        let stringMin:string=" au minimum "
        let stringMax:string=" au maximum "
        let stringOperation:string=String(this.formUpdatePassword.get(key)!.errors!["pattern"].requiredPattern)
        console.log(stringOperation);

        let res:string=""
        if(stringOperation.indexOf("a-z")!=-1)
        {
          res="Ce champs doit contenir"
          res=res+stringAlpha
        }
        if(stringOperation.indexOf("0-9")!=-1){
          if(res.length==0){res="Ce champs doit contenir"
        res=res+ stringdigit}else{

          res=res+"et"+stringdigit
        }
      }

        if (stringOperation.includes("{")) {
          let min:number=Number(stringOperation.substring(
            stringOperation.indexOf("{")+1,
            stringOperation.indexOf(",")
          ))
          res=res.concat("avec un taille de "+min+stringMin)
          if ((Number(stringOperation.substring(stringOperation.indexOf(",")+1,stringOperation.indexOf("}")))!==0)) {
            let max:number=Number(stringOperation.substring(
              stringOperation.indexOf(",")+1,
              stringOperation.indexOf("}")
            ))
            res=res.concat("et de "+max+stringMax)
          }
        }

        Report.failure(key,res,"D'accord")
      }

     }
  })
  }

}
