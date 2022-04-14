import { MapsAPILoader } from '@agm/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Notify, Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { Location } from 'src/app/models/Location';

import { Material } from 'src/app/models/resources/Material';
import { AddressService } from 'src/app/services/address/address.service';
import { EquipmentService } from 'src/app/services/resources/material/material.service';

@Component({
  selector: 'app-add-materials',
  templateUrl: './add-materials.component.html',
  styleUrls: ['./add-materials.component.css'],
})
export class AddMaterialsComponent implements OnInit {
  formAddMaterials!: FormGroup;
  states!:string[]
  cities!:string[]
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private formBuilder: FormBuilder,
    private addressService:AddressService,

    private materialService: EquipmentService,
    private router: Router
  ) {
    this.formAddMaterials = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      status: ['', [Validators.required]],

      dateOfPurshase: ['', [Validators.required]],
      description: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
      ],
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

    });
    this.counrty?.setValue("Tunisie")

    this.city?.disable()
    this.collectStates()
  }

  ngOnInit() {this.counrty?.setValue('Tunisie')
}

  addMaterial() {
    let address = new Address(
      this.zipCode?.value,
      this.street?.value,
      this.city?.value,
      this.state?.value,
      this.counrty?.value,
      new Location(1, 1)
    );
    //  console.log(location)
    let material = new Material(
      String(this.name?.value),
      String(this.description?.value),
      address,
      this.dateOfPurshase?.value,
      String(this.status?.value)
    );
    console.log(material);
    this.materialService.create(material).subscribe((data) => {
      console.log(data);
      Notify.success('Materiel est ajouté avec succès');
      this.router.navigate(['manager/materialList']);
    }),
      (error: HttpErrorResponse) => {
        Report.warning('Erreur', error.message, 'OK');
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
  get name() {
    return this.formAddMaterials.get('name');
  }
  get status() {
    return this.formAddMaterials.get('status');
  }
  get dateOfPurshase() {
    return this.formAddMaterials.get('dateOfPurshase');
  }
  get description() {
    return this.formAddMaterials.get('description');
  }
  get city() {
    return this.formAddMaterials.get('city');
  }
  get state() {
    return this.formAddMaterials.get('state');
  }
  get street() {
    return this.formAddMaterials.get('street');
  }
  get counrty() {
    return this.formAddMaterials.get('country');
  }
  get zipCode() {
    return this.formAddMaterials.get('zipCode');
  }
}
