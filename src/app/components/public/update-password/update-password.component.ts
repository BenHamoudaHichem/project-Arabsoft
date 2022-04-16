import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  constructor(private formBuilder: FormBuilder) {
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
  changePassword() {
    console.log(this.formUpdatePassword.value);
  }
  checkCaptcha(captchaResponse: string) {
    console.log(
      (this.captchaResolved =
        captchaResponse && captchaResponse.length > 0 ? true : false)
    );
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
