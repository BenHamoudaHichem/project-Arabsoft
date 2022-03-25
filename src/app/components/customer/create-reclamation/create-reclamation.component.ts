import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Notify, Report } from 'notiflix';
import { Location } from 'src/app/models/Location';
import { Demand } from 'src/app/models/works/demand';
import { DemandService } from 'src/app/services/works/demand/demand.service';

@Component({
  selector: 'app-create-reclamation',
  templateUrl: './create-reclamation.component.html',
  styleUrls: ['./create-reclamation.component.css'],
})
export class CreateReclamationComponent implements OnInit {
  reclamationForm!: FormGroup;
  keyApi = 'y0pZ5MO8SJJ5s54Q2X7rf1CtT5GnrUTY';
  constructor(
    private formBuilder: FormBuilder,
    private demandeService: DemandService,
    private router: Router
  ) {
    this.reclamationForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      description: ['',[Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      location: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  sendDemand() {
    let demand = new Demand(
      String(this.Title?.value),
      String(this.Description?.value),
      new Date(),
      String(this.location?.value),
      '',
      ''
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
  get location() {
    return this.reclamationForm.get('location');
  }
  ngOnInit(): void {}
}
