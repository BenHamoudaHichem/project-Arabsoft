import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Report } from 'notiflix';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  mailForm: FormGroup;
  constructor(
    private route: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private formBuilder: FormBuilder
  ) {
    this.mailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  authRoute() {
    return (
      this.route.url == '/register' ||
      this.route.url == '/login' ||
      this.route.url == '/forgotPassword' ||
      this.route.url.includes("reset") ||
      this.route.url == '/not-found'
    );
  }
  checkContactRoute() {
    return this.route.url == '/contact';
  }
  mail() {
    this.storage.set('email', this.email?.value);
    this.route.navigateByUrl('/contact');
  }

  get email() {
    return this.mailForm.get('email');
  }

  ngOnInit(): void {}
  check() {
    Object.keys(this.mailForm.controls).forEach((key) => {
      if (this.mailForm.get(key)!.errors) {
        console.log(this.mailForm.get(key)!.errors);
        if (this.mailForm.get(key)!.errors!.hasOwnProperty('required')) {
          Report.failure(key, 'Champs obligatoire', "D'accord");
        }
        if (this.mailForm.get(key)!.errors!.hasOwnProperty('pattern')) {
          let stringAlpha: string = ' des lettres alphabétiques ';
          let stringdigit: string = ' des chiffres ';
          let stringMin: string = ' au minimum ';
          let stringMax: string = ' au maximum ';
          let stringOperation: string = String(
            this.mailForm.get(key)!.errors!['pattern'].requiredPattern
          );
          console.log(stringOperation);

          let res: string = '';
          if (stringOperation.indexOf('a-z') != -1) {
            res = 'Ce champs doit contenir';
            res = res + stringAlpha;
          }
          if (stringOperation.indexOf('0-9') != -1) {
            if (res.length == 0) {
              res = 'Ce champs doit contenir';
              res = res + stringdigit;
            } else {
              res = res + 'et' + stringdigit;
            }
          }

          if (stringOperation.includes('{')) {
            let min: number = Number(
              stringOperation.substring(
                stringOperation.indexOf('{') + 1,
                stringOperation.indexOf(',')
              )
            );
            res = res.concat('avec un taille de ' + min + stringMin);
            if (
              Number(
                stringOperation.substring(
                  stringOperation.indexOf(',') + 1,
                  stringOperation.indexOf('}')
                )
              ) !== 0
            ) {
              let max: number = Number(
                stringOperation.substring(
                  stringOperation.indexOf(',') + 1,
                  stringOperation.indexOf('}')
                )
              );
              res = res.concat('et de ' + max + stringMax);
            }
          }

          Report.failure(key, res, "D'accord");
        }
      }
    });
  }
}
