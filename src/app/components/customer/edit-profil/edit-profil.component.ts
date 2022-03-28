import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { Confirmed } from 'src/app/services/validation/Confirmed';
import { Location } from 'src/app/models/Location';
@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.component.html',
  styleUrls: ['./edit-profil.component.css']
})
export class EditProfilComponent implements OnInit {

  updateForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.updateForm = this.formBuilder.group(
      {
        firstName: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
        ],
        lastNamme: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
        ],
        tel: ['', [Validators.required, , Validators.pattern('^[0-9]{8}$')]],
        identifier: ['', [Validators.required, Validators.minLength(8)]],
        password: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]{8,}$')],
        ],
        confirm_password: ['', [Validators.required]],
        state: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
        ],
        city: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
        ],
        street: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
        ],
        country: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
        ],
        zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      },
      {
        Validators: Confirmed.ConfirmedValidator(
          'password',
          'confirm_password'
        ),
      }
    );
  }

  ngOnInit(): void {}
  Update() {
    let adresse = new Address(
      String(this.zipCode?.value),
      String(this.street?.value),
      String(this.city?.value),
      String(this.state?.value),
      String(this.counrty?.value),
      new Location(1, 1)
    );
    let user = new User(
      '',
      String(this.firstName?.value),
      String(this.lastNamme?.value),
      String(this.identifier?.value),
      String(this.password?.value),
      adresse,
      String(this.tel?.value),

      ['']
    );
    console.log(user);
    this.userService.create(user).subscribe((res: any) => {
      Report.success("Notification d'inscription", res.message, "D'accord");
      this.router.navigateByUrl('/login');
    }),
      (error: HttpErrorResponse) => {
        Report.warning("Notification d'inscription", error.message, "D'accord");
      };
  }
  get state() {
    return this.updateForm.get('state');
  }
  get firstName() {
    return this.updateForm.get('firstName');
  }
  get lastNamme() {
    return this.updateForm.get('lastNamme');
  }

  get identifier() {
    return this.updateForm.get('identifier');
  }
  get confirmPassword() {
    return this.updateForm.get('confirm_password');
  }
  get password() {
    return this.updateForm.get('password');
  }
  get city() {
    return this.updateForm.get('city');
  }
  get street() {
    return this.updateForm.get('street');
  }
  get tel() {
    return this.updateForm.get('tel');
  }

  get counrty() {
    return this.updateForm.get('country');
  }
  get zipCode() {
    return this.updateForm.get('zipCode');
  }
  get confirm_password() {
    return this.updateForm.get('confirm_password');
  }

}
