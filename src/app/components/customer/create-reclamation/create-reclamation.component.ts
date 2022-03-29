import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Notify, Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { Location } from 'src/app/models/Location';
import { Demand } from 'src/app/models/works/demand';
import { CookiesService } from 'src/app/services/cookies.service';
import { DemandService } from 'src/app/services/works/demand/demand.service';

@Component({
  selector: 'app-create-reclamation',
  templateUrl: './create-reclamation.component.html',
  styleUrls: ['./create-reclamation.component.css'],
})
export class CreateReclamationComponent implements OnInit {
  reclamationForm!: FormGroup;
  id!: string;
  constructor(
    private formBuilder: FormBuilder,
    private demandeService: DemandService,
    private router: Router,
    private cookiesServices: CookiesService
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
  }

  sendDemand() {
    this.id = this.cookiesServices.getIdentifier;
    let adresse = new Address(
      String(this.zipCode?.value),
      String(this.street?.value),
      String(this.city?.value),
      String(this.state?.value),
      String(this.counrty?.value),
      new Location(1, 1)
    );
    let demand = new Demand(
      String(this.Title?.value),
      String(this.Description?.value),
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
        Report.failure('Erreur', error.message, "D'accord");
      };
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
  ngOnInit(): void {}
}
