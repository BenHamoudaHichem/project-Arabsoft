import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  keyApi="y0pZ5MO8SJJ5s54Q2X7rf1CtT5GnrUTY"
  constructor(private formBuilder: FormBuilder, private demandeService:DemandService) {
    this.reclamationForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      description: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
      ],
      createdAt: ['', [Validators.required]],
      lieu: ['', [Validators.required]],
    });
  }

  sendDemand() {
    let demand = new Demand(

      String(this.Title?.value),
      String(this.Description?.value),
      this.createdAt?.value,
      String(this.Lieu?.value),
      '',
      ''
    );


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
  get Lieu() {
    return this.reclamationForm.get('lieu');
  }
  ngOnInit(): void {}
}
