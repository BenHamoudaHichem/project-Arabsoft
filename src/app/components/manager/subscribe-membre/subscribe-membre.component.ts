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
import { AddressService } from 'src/app/services/address/address.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
@Component({
  selector: 'app-subscribe-membre',
  templateUrl: './subscribe-membre.component.html',
  styleUrls: ['./subscribe-membre.component.css']
})
export class SubscribeMembreComponent implements OnInit {

  addCustomerForm!: FormGroup
  states!:string[]
  cities!:string[]

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private addressService:AddressService,
    private router: Router,
    private AuthenticateService:AuthenticateService
  ) {
    this.addCustomerForm = this.formBuilder.group(
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
        identifier: ['', [Validators.required,Validators.minLength(8)]],
        password: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]{8,}$')],
        ],
        confirm_password: ['', [Validators.required]],
        state: ['', Validators.required],
        city: ['', Validators.required],
        street: ['', Validators.required],
        country: ['', Validators.required],
        zipCode: ['', Validators.required],
      },
      {
        Validators: Confirmed .ConfirmedValidator(
          'password',
          'confirm_password'
        ),
      }
    );
    this.counrty?.setValue("Tunisie")

    this.city?.disable()
    this.collectStates()
  }

  ngOnInit(): void {this.counrty?.setValue('Tunisie')
}
  Inscrire() {
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
      ['member']
    );
    console.log(user);
    this.userService.create(user).subscribe((res: any) => {
      Report.success(
        "Notification d'affectation",res.message,"D'accord"
        );
      this.router.navigate(['dashboard/login']);
    }),
      (error: HttpErrorResponse) => {
        if(error.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        } else{
          Report.warning(
            "Notification d'affectation",error.message,"D'accord"
            );
        }

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
    return this.addCustomerForm.get('state');
  }
  get firstName() {
    return this.addCustomerForm.get('firstName');
  }
  get lastNamme() {
    return this.addCustomerForm.get('lastNamme');
  }

  get identifier() {
    return this.addCustomerForm.get('identifier');
  }
  get confirmPassword() {
    return this.addCustomerForm.get('confirm_password');
  }
  get password() {
    return this.addCustomerForm.get('password');
  }
  get city() {
    return this.addCustomerForm.get('city');
  }
  get street() {
    return this.addCustomerForm.get('street');
  }
  get tel() {
    return this.addCustomerForm.get('tel');
  }

  get counrty() {
    return this.addCustomerForm.get('country');
  }
  get zipCode() {
    return this.addCustomerForm.get('zipCode');
  }
  get confirm_password() {
    return this.addCustomerForm.get('confirm_password');
  }

}
