import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Report } from 'notiflix';
import { lastValueFrom, of } from 'rxjs';
import { AuthenticateService } from 'src/app/services/authenticate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(private formBuilder: FormBuilder,private authService : AuthenticateService,private router:Router) {
    this.loginForm = this.formBuilder.group({
      identifier: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {}

  Login() {
    console.log(this.Identifier?.value, this.Password?.value);
     this.authService.login(this.Identifier?.value,this.Password?.value).subscribe((res:any)=>{

      if (!res.status) {

        this.authService.onLoginSucces(res.token,res.id,res.roles[0],res.username)
        this.router.navigate([""])

      }


    })

  }

  get Identifier() {
    return this.loginForm.get('identifier');
  }
  get Password() {
    return this.loginForm.get('password');
  }

  getErrorMessage(key: any) {
    if (this.loginForm.controls[key].errors?.['required']) {
      return 'Vous devez saisir votre ' + key;
    }
    return 'Email mal saisie ';
  }
}
