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
import { HTMLEscape } from 'src/app/services/validation/HTMLEscapeChars';
import { CAPTCHA_KEY } from 'src/app/services/properties';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  states!: string[];
  cities!: string[];
  public captchaResolved: boolean = false;
  siteKey = CAPTCHA_KEY;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthenticateService,
    private addressService: AddressService
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
        identifier: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]{8,}$')],
        ],
        confirm_password: ['Tunisie', [Validators.required]],
        captcha: ['', [Validators.required]],
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

    this.counrty?.setValue('Tunisie');
    this.city?.disable();
    this.collectStates();
  }

  ngOnInit(): void {
    this.counrty?.setValue('Tunisie');

    if (this.authService.isLogin) {
      this.router.navigate(['/dashboard/not-found']);
    }
  }
  Register() {
    let adresse = new Address(
      HTMLEscape.escapeMethod(String(this.zipCode?.value)),
      HTMLEscape.escapeMethod(String(this.street?.value)),
      HTMLEscape.escapeMethod(String(this.city?.value)),
      HTMLEscape.escapeMethod(String(this.state?.value)),
      HTMLEscape.escapeMethod(String(this.counrty?.value)),
      new Location(1, 1)
    );
    let user = new User(
      '',
      HTMLEscape.escapeMethod(String(this.firstName?.value)),
      HTMLEscape.escapeMethod(String(this.lastNamme?.value)),
      HTMLEscape.escapeMethod(String(this.identifier?.value)),
      HTMLEscape.escapeMethod(String(this.password?.value)),
      adresse,
      HTMLEscape.escapeMethod(String(this.tel?.value)),

      ['']
    );
    console.log(user);
    this.userService.create(user).subscribe((res: any) => {
      if (res.status == true) {
        Report.success("Notification d'inscription", res.message, "D'accord");
      } else {
        Report.warning("Notification d'inscription", res.message, "D'accord");
      }
      this.router.navigateByUrl('/login');
    }),
      (error: HttpErrorResponse) => {
        Report.warning("Notification d'inscription", error.message, "D'accord");
      };
  }
  collectStates() {
    this.addressService.allTNStates.subscribe((res: string[]) => {
      this.states = res;
    });
  }
  collectCitiesBystates(state: string) {
    this.addressService.allTNCitiesByState(state).subscribe((res: string[]) => {
      this.cities = res;
    });
  }
  loadCities() {
    if (this.city?.disabled) {
      this.city?.enable();
    }

    this.collectCitiesBystates(this.state?.value);
  }
  checkCaptcha(captchaResponse: string) {
    console.log(
      (this.captchaResolved =
        captchaResponse && captchaResponse.length > 0 ? true : false)
    );
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
  check()
{
 Object.keys(this.registerForm.controls).forEach(key => {
   if (this.registerForm.get(key)!.errors) {
   console.log(this.registerForm.get(key)!.errors)
    if(this.registerForm.get(key)!.errors!.hasOwnProperty('required'))
    {
      Report.failure(key,"Champs obligatoire","D'accord")
    }
    if(this.registerForm.get(key)!.errors!.hasOwnProperty('pattern'))
    {
      let stringAlpha:string=" des lettres alphabétiques "
      let stringdigit:string=" des chiffres "
      let stringMin:string=" au minimum "
      let stringMax:string=" au maximum "
      let stringOperation:string=String(this.registerForm.get(key)!.errors!["pattern"].requiredPattern)
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
