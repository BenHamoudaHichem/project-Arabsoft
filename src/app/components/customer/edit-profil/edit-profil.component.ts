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
import { AddressService } from 'src/app/services/address/address.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { HTMLEscape } from 'src/app/services/validation/HTMLEscapeChars';
import { plainToClass } from 'class-transformer';
@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.component.html',
  styleUrls: ['./edit-profil.component.css'],
})
export class EditProfilComponent implements OnInit {
  updateForm!: FormGroup;
  states!:string[]
  cities!:string[]
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private addressService:AddressService,
    private router: Router,
    private cookies: CookiesService,private AuthenticateService:AuthenticateService
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

    )
    this.counrty?.setValue("Tunisie")

    this.city?.disable()
    this.collectStates()
  }

  ngOnInit(): void {
    if (this.cookies.getIdentifier!= null) {
      this.showUser();
    }else{
      Report.warning('Error','Erreur de chargement de la page, aucun identifiant à étè detecté',"OK")
    }
  }

  showUser() {

    this.userService.getUser(this.cookies.getIdentifier).subscribe((res: IUser) => {
      res.address=plainToClass(Address,res.address)
      this.firstName?.setValue(res.firstName),
        this.lastNamme?.setValue(res.lastName),
        this.tel?.setValue(res.tel),
        this.counrty?.setValue(res.address.Country);
        this.state?.setValue(res.address.State),
        this.loadCities()
      this.city?.setValue(res.address.City),
        this.street?.setValue(res.address.Street)


    }),
      (error: HttpErrorResponse) => {
        if(error.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        }      };
  }

  Update() {
    let adresse = new Address(
      HTMLEscape.escapeMethod(String(this.zipCode?.value)),
      HTMLEscape.escapeMethod(String(this.street?.value)),
      HTMLEscape.escapeMethod(String(this.city?.value)),
      HTMLEscape.escapeMethod(String(this.state?.value)),
      HTMLEscape.escapeMethod(String(this.counrty?.value)),
      new Location(1, 1)
    );
    let user = new User(
      this.cookies.getIdentifier,
      HTMLEscape.escapeMethod(String(this.firstName?.value)),
      HTMLEscape.escapeMethod(String(this.lastNamme?.value)),
      HTMLEscape.escapeMethod(String(this.identifier?.value)),
      "",
      adresse,
      HTMLEscape.escapeMethod(String(this.tel?.value)),
      ['']
    );
    console.log(user);
    this.userService.update(user,this.cookies.getIdentifier).subscribe((res: any) => {
      Report.success("Notification de modification", res.message, "D'accord");
      this.router.navigateByUrl('/customer/customerProfil');
    }),
      (error: HttpErrorResponse) => {
        if(error.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        }   };
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
