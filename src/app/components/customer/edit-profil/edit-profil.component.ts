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
import { CookiesService } from 'src/app/services/cookies.service';
import { IUser } from 'src/app/services/user/iuser';
@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.component.html',
  styleUrls: ['./edit-profil.component.css'],
})
export class EditProfilComponent implements OnInit {
  updateForm!: FormGroup;
  id!: string;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private cookies: CookiesService
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
        zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      },
      {
        Validators: Confirmed.ConfirmedValidator(
          'password',
          'confirm_password'
        ),
      }
    );
  }

  ngOnInit(): void {
    if (this.id != null) {
      this.showUser();
    }else{
      Report.warning('Error','Erreur de chargement de la page, aucun identifiant à étè detecté',"OK")
    }
  }

  showUser() {
    this.id = this.cookies.getIdentifier;
    this.userService.getUser(this.id).subscribe((res: IUser) => {
      this.firstName?.setValue(res.firstName),
        this.lastNamme?.setValue(res.lastName),
        this.tel?.setValue(res.tel),
        this.counrty?.setValue(res.address.getCountry());
      this.city?.setValue(res.address.getCity()),
        this.street?.setValue(res.address.getStreet()),
        this.state?.setValue(res.address.getState()),
        this.password?.setValue(res.password),
        this.confirmPassword?.setValue(res.password);
    }),
      (error: HttpErrorResponse) => {
        Report.warning('Error', error.message, 'OK');
      };
  }

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
      this.id,
      String(this.firstName?.value),
      String(this.lastNamme?.value),
      String(this.identifier?.value),
      String(this.password?.value),
      adresse,
      String(this.tel?.value),
      ['']
    );
    console.log(user);
    this.userService.update(user).subscribe((res: any) => {
      Report.success("Notification de modification", res.message, "D'accord");
      this.router.navigateByUrl('/customer/customerProfil');
    }),
      (error: HttpErrorResponse) => {
        Report.warning("Erreur de modification", error.message, "D'accord");
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
