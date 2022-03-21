import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from 'src/app/models/Address';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { Confirmed } from 'src/app/services/validation/Confirmed';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,private userService:UserService,private router:Router) {
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
        confirm_password: ['', [Validators.required]],
        Gouvernorat: ['', Validators.required],
        Ville: ['', Validators.required],
        Roue: ['', Validators.required],
      },
      {
        validators: Confirmed.ConfirmedValidator(
          'password',
          'confirm_password'
        ),
      }
    );
  }

  ngOnInit(): void {}

  Register() {
    let adresse = new Address(

      String(this.Gouvernorat?.value),
      String(this.Ville?.value),
      String(this.Roue?.value),
      String(this.Roue?.value)
    );
    let user = new User(
      '',
      String(this.firstName?.value),
      String(this.lastNamme?.value),
      String(this.password?.value),
      String(this.identifier?.value),
      String(this.tel?.value),
      adresse
    );
    console.log(user);
    this.userService.create(user).subscribe((user:any)=>
    {
      alert("vous avez inscrit avec suuces ")
      console.log("vous avez inscrit avec suuces ")
      this.router.navigateByUrl("/login")

    }),(error:HttpErrorResponse)=>
    {alert(error.message);}

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
  get Gouvernorat() {
    return this.registerForm.get('Gouvernorat');
  }
  get Ville() {
    return this.registerForm.get('Ville');
  }
  get Roue() {
    return this.registerForm.get('Roue');
  }
  get tel() {
    return this.registerForm.get('tel');
  }

  get confirm_password() {
    return this.registerForm.get('confirm_password');
  }
}
