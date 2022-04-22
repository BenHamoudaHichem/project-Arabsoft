import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Notify, Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { Location } from 'src/app/models/Location';
import { Demand } from 'src/app/models/works/demand';
import { AddressService } from 'src/app/services/address/address.service';
import { CookiesService } from 'src/app/services/cookies.service';
import {  AuthenticateService} from 'src/app/services/authenticate.service'
import { DemandService } from 'src/app/services/works/demand/demand.service';
import { HTMLEscape } from 'src/app/services/validation/HTMLEscapeChars';

@Component({
  selector: 'app-create-reclamation',
  templateUrl: './create-reclamation.component.html',
  styleUrls: ['./create-reclamation.component.css'],
})
export class CreateReclamationComponent implements OnInit {
  reclamationForm!: FormGroup;
  id!: string;
  states!:string[]
  cities!:string[]
  constructor(
    private formBuilder: FormBuilder,
    private demandeService: DemandService,
    private router: Router,
    private addressService:AddressService,
    private cookiesServices: CookiesService,
    private AuthenticateService:AuthenticateService
  ) {
    this.reclamationForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      state: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      street: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
      ],
      country: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
      ],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{4,}$')]],
    });
    this.counrty?.setValue("Tunisie")

    this.city?.disable()
    this.collectStates()

  }

  sendDemand() {
    this.id = this.cookiesServices.getIdentifier;
    let adresse = new Address(
      HTMLEscape.escapeMethod(String(this.zipCode?.value)),
      HTMLEscape.escapeMethod(String(this.street?.value)),
      HTMLEscape.escapeMethod(String(this.city?.value)),
      HTMLEscape.escapeMethod(String(this.state?.value)),
      HTMLEscape.escapeMethod(String(this.counrty?.value)),
      new Location(1, 1)
    );
    let demand = new Demand(
      HTMLEscape.escapeMethod(String(this.Title?.value)),
      HTMLEscape.escapeMethod(String(this.Description?.value)),
      adresse,
      new Date(),
      'In_Progress',
      { id: this.id }
    );
    this.demandeService.create(demand).subscribe((data) => {
      console.log(JSON.stringify(data));
      Notify.success('La reclamation est envoyée avec succès ');
      this.router.navigate(['/customer/detailReclamation']);
    }),
      (error: HttpErrorResponse) => {
        if(error.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        }else{
          Report.failure('Erreur', error.message,'OK')

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
  get Title() {
    return this.reclamationForm.get('title');
  }
  get Description() {
    return this.reclamationForm.get('description');
  }
  get createdAt() {
    return this.reclamationForm.get('createdAt');
  }
  get state() {
    return this.reclamationForm.get('state');
  }
  get city() {
    return this.reclamationForm.get('city');
  }
  get street() {
    return this.reclamationForm.get('street');
  }
  get tel() {
    return this.reclamationForm.get('tel');
  }

  get counrty() {
    return this.reclamationForm.get('country');
  }
  get zipCode() {
    return this.reclamationForm.get('zipCode');
  }
  ngOnInit(): void {this.counrty?.setValue('Tunisie')
}

check()
{
 Object.keys(this.reclamationForm.controls).forEach(key => {
   if (this.reclamationForm.get(key)!.errors) {
   console.log(this.reclamationForm.get(key)!.errors)
    if(this.reclamationForm.get(key)!.errors!.hasOwnProperty('required'))
    {
      Report.failure(key,"Champs obligatoire","D'accord")
    }
    if(this.reclamationForm.get(key)!.errors!.hasOwnProperty('pattern'))
    {
      let stringAlpha:string=" des lettres alphabétiques "
      let stringdigit:string=" des chiffres "
      let stringMin:string=" au minimum "
      let stringMax:string=" au maximum "
      let stringOperation:string=String(this.reclamationForm.get(key)!.errors!["pattern"].requiredPattern)
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
