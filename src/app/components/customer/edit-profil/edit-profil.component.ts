import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
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
    private cookies: CookiesService,
    private AuthenticateService:AuthenticateService
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
        zipCode: ['', [Validators.required, Validators.pattern('^[0-9 -]{4}$')]],
      },

    )
    this.counrty?.setValue("Tunisie")

    this.city?.disable()
    this.collectStates()
  }

  ngOnInit(): void {
    if (this.cookies.getIdentifier!= null) {
      this.findUser();
    }else{
      Report.warning('Error','Erreur de chargement de la page, aucun identifiant à étè detecté',"OK")
    }
  }

  findUser() {

    this.userService.findUser(this.cookies.getIdentifier).subscribe((res) => {
      res.body!.address=plainToClass(Address,res.body!.address)
      this.firstName?.setValue(res.body!.firstName),
        this.lastNamme?.setValue(res.body!.lastName),
        this.tel?.setValue(res.body!.tel),
        this.identifier?.setValue(res.body!.identifier)
        this.counrty?.setValue(res.body!.address.Country);
        this.state?.setValue(res.body!.address.State),
        this.loadCities()
      this.city?.setValue(res.body!.address.City),
        this.street?.setValue(res.body!.address.Street),
        this.zipCode?.setValue(res.body!.address.ZipCode)


    }),
      (error: HttpErrorResponse) => {
        if(error.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        }else{
          Report.failure('Erreur', error.message,'OK')

        }     };
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

        }else{
          Report.failure('Erreur', error.message,'OK')

        }}
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

check()
{
 Object.keys(this.updateForm.controls).forEach(key => {
   if (this.updateForm.get(key)!.errors) {
   console.log(this.updateForm.get(key)!.errors)
    if(this.updateForm.get(key)!.errors!.hasOwnProperty('required'))
    {
      Report.failure(key,"Champs obligatoire","D'accord")
    }
    if(this.updateForm.get(key)!.errors!.hasOwnProperty('pattern'))
    {
      let stringAlpha:string=" des lettres alphabétiques "
      let stringdigit:string=" des chiffres "
      let stringMin:string=" au minimum "
      let stringMax:string=" au maximum "
      let stringOperation:string=String(this.updateForm.get(key)!.errors!["pattern"].requiredPattern)
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
