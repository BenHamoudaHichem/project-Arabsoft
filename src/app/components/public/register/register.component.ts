import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from 'src/app/models/Address';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { Confirmed } from 'src/app/services/validation/Confirmed';
import { Location } from 'src/app/models/Location';
import { Report } from 'notiflix';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { AddressService } from 'src/app/services/address/address.service';
@Component({
  selector: 'app-register',
  templateUrl:'./register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  states!:string[]
  cities!:string[]
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService:AuthenticateService,
    private addressService:AddressService
  ) {
    this.registerForm = this.formBuilder.group(
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
        confirm_password: ['Tunisie', [Validators.required]],
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

    this.counrty?.setValue("Tunisie")
    this.city?.disable()
    this.collectStates()

  }

  ngOnInit(): void {
    if(this.authService.isLogin)
    {
      this.router.navigate(['/dashboard/not-found'])
    }
  }
  Register() {
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
      if(res.status==true)
      {
        Report.success("Notification d'inscription", res.message, "D'accord");

      }
      else{
        Report.warning("Notification d'inscription", res.message, "D'accord");
      }
      this.router.navigateByUrl('/login');
    }),
      (error: HttpErrorResponse) => {
        Report.warning("Notification d'inscription", error.message, "D'accord");
      };
  }
  collectStates()
  {

    this.addressService.allTNStates.subscribe((res:string[])=>{
      this.states=res
    })
  }
  collectCitiesBystates(state:string)
  {
    this.addressService.allTNCitiesByState(state).subscribe((res:string[])=>{
      this.cities=res
    })
  }
  loadCities(){
    if (this.city?.disabled) {
      this.city?.enable()
    }

    this.collectCitiesBystates(this.state?.value)
  }
  get state() {
    return this.registerForm.get('state');
  }
  get firstName() {
    return this.registerForm.get('firstName');
  }
  get lastNamme() {
    return this.registerForm.get('lastNamme');
  }

  get identifier() {
    return this.registerForm.get('identifier');
  }
  get confirmPassword() {
    return this.registerForm.get('confirm_password');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get city() {
    return this.registerForm.get('city');
  }
  get street() {
    return this.registerForm.get('street');
  }
  get tel() {
    return this.registerForm.get('tel');
  }

  get counrty() {
    return this.registerForm.get('country');
  }
  get zipCode() {
    return this.registerForm.get('zipCode');
  }
  get confirm_password() {
    return this.registerForm.get('confirm_password');
  }
}
