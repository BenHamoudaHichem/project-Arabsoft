import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Notify, Report } from 'notiflix';
import { Contact } from 'src/app/models/Contact';
import { ContactUsService } from 'src/app/services/contact/contact-us.service';
import { HTMLEscape } from 'src/app/services/validation/HTMLEscapeChars';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUSComponent implements OnInit {
  contactForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactUsService,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {
    this.contactForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      phone: ['', [Validators.required, , Validators.pattern('^[0-9]{8}$')]],
      email: ['', [Validators.required, Validators.email]],
      description: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    if(this.storage.has('email')){
   this.email?.setValue(this.storage.get('email'))
   this.storage.remove('email')

 }}
  send() {

    console.log(JSON.stringify(this.contactForm.value));
    let contact = new Contact(
      HTMLEscape.escapeMethod(this.fullName?.value),
      HTMLEscape.escapeMethod(this.phone?.value),
      HTMLEscape.escapeMethod(this.email?.value),
      HTMLEscape.escapeMethod(this.description?.value)
    );

    this.contactService.create(contact).subscribe((res: any) => {
      if (res.status == true) {
        Notify.success('Message envoyé avec succèes!');
      }
      if (res.status == false) {
        Notify.failure("Echec d'envoi");
      }
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }),
      (error: HttpErrorResponse) => {
        Report.warning('error', error.message, 'OK');
      };
  }

  get fullName() {
    return this.contactForm.get('fullName');
  }
  get phone() {
    return this.contactForm.get('phone');
  }
  get email() {
    return this.contactForm.get('email');
  }
  get description() {
    return this.contactForm.get('description');
  }
  check() {
    Object.keys(this.contactForm.controls).forEach((key) => {
      if (this.contactForm.get(key)!.errors) {
        console.log(this.contactForm.get(key)!.errors);
        if (this.contactForm.get(key)!.errors!.hasOwnProperty('required')) {
          Report.failure(key, 'Champs obligatoire', "D'accord");
        }
        if (this.contactForm.get(key)!.errors!.hasOwnProperty('pattern')) {
          let stringAlpha: string = ' des lettres alphabétiques ';
          let stringdigit: string = ' des chiffres ';
          let stringMin: string = ' au minimum ';
          let stringMax: string = ' au maximum ';
          let stringOperation: string = String(
            this.contactForm.get(key)!.errors!['pattern'].requiredPattern
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
