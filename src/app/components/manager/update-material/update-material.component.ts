import { MapsAPILoader } from '@agm/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Notify, Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { Material } from 'src/app/models/resources/Material';
import { EquipmentService } from 'src/app/services/resources/material/material.service';
import { Location } from 'src/app/models/Location';
import { IMaterial } from 'src/app/services/resources/material/imaterial';

@Component({
  selector: 'app-update-material',
  templateUrl: './update-material.component.html',
  styleUrls: ['./update-material.component.css'],
})
export class UpdateMaterialComponent implements OnInit {
  id!: string;
  formupdateMaterials!: FormGroup;
  material!: IMaterial;
  constructor(
    private ActivatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private materialService: EquipmentService,
    private router: Router
  ) {
    this.formupdateMaterials = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      status: ['', [Validators.required]],

      dateOfPurshase: ['', [Validators.required]],
      description: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
      ],
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
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    });
  }

  ngOnInit() {
    this.show();
  }
  show() {
    this.ActivatedRoute.queryParams.subscribe((params) => {
      this.id = params['id'];
      console.log(this.id);
    });
    if (this.id != null) {
      this.materialService
        .showMaterial(this.id)
        .subscribe((data: IMaterial) => {
          this.material=data
          this.name?.setValue(data.name);
          this.description?.setValue(data.description);
          this.dateOfPurshase?.setValue(data.dateOfPurshase);
          this.city?.setValue(data.address.City);
          this.counrty?.setValue(data.address.Country);
          this.street?.setValue(data.address.Street);
          this.zipCode?.setValue(data.address.ZipCode);
          this.state?.setValue(data.address.State);
          this.status?.setValue(data.status);
        });
    }
  }
updateMaterial() {
    let address = new Address(
      this.zipCode?.value,
      this.street?.value,
      this.city?.value,
      this.state?.value,
      this.counrty?.value,
      new Location(1, 1)
    );
    //  console.log(location)
    let newMaterial = new Material(
      String(this.name?.value),
      String(this.description?.value),
      address,
      this.dateOfPurshase?.value,
      String(this.status?.value)
    );
    this.materialService.update(this.material.id,newMaterial).subscribe((data:any) => {
      console.log(data);
      if(data.status)
      {Notify.success('Materiel est modifié avec succès');
      this.router.navigate(['manager/materialList']);}else{Notify.failure(data.message)}
    }),
      (error: HttpErrorResponse) => {
        Report.warning('Erreur', error.message, 'OK');
      };
  }

  get name() {
    return this.formupdateMaterials.get('name');
  }
  get status() {
    return this.formupdateMaterials.get('status');
  }
  get dateOfPurshase() {
    return this.formupdateMaterials.get('dateOfPurshase');
  }
  get description() {
    return this.formupdateMaterials.get('description');
  }
  get city() {
    return this.formupdateMaterials.get('city');
  }
  get state() {
    return this.formupdateMaterials.get('state');
  }
  get street() {
    return this.formupdateMaterials.get('street');
  }
  get counrty() {
    return this.formupdateMaterials.get('country');
  }
  get zipCode() {
    return this.formupdateMaterials.get('zipCode');
  }
}
