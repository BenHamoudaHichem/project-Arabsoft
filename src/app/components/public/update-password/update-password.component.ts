import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Report } from 'notiflix';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { UserService } from 'src/app/services/user/user.service';
import { Confirmed } from 'src/app/services/validation/Confirmed';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css'],
})
export class UpdatePasswordComponent implements OnInit {
  public captchaResolved: boolean = false;
  siteKey = '6LcOuyYTAAAAAHTjFuqhA52fmfJ_j5iFk5PsfXaU';
  formUpdatePassword!: FormGroup;
  constructor(private formBuilder: FormBuilder,private userService:UserService,private authService:AuthenticateService) {
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
    let passwordRequest:any={id:this.authService.authentificatorId,oldPassword:String(this.old_password?.value),newPassword:String(this.new_password?.value)}

    this.userService.changePassword(passwordRequest).subscribe((res:any)=>{
      if (res.status==true) {

        Report.success("Changer Mot de passe", res.message,"D'accord")
      } else {

        Report.failure("Changer Mot de passe", res.message,"D'accord")

      }
    })
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
}
