import { MapsAPILoader } from '@agm/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import moment from 'moment';
import { Notify, Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { Location } from 'src/app/models/Location';

import { Material } from 'src/app/models/resources/Material';
import { QuantityValue } from 'src/app/models/resources/QuantityValue';
import { AddressService } from 'src/app/services/address/address.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { EquipmentService } from 'src/app/services/resources/material/material.service';
import { Associatif } from 'src/app/services/types/associatif';
import { HTMLEscape } from 'src/app/services/validation/HTMLEscapeChars';

@Component({
  selector: 'app-add-materials',
  templateUrl: './add-materials.component.html',
  styleUrls: ['./add-materials.component.css'],
})
export class AddMaterialsComponent implements OnInit {
  formAddMaterials!: FormGroup;
  states!: string[];
  cities!: string[];
  categoryList: Associatif[] = [
    { key: 'Material', value: 'Material' },
    { key: 'Matter', value: 'Matter' },
  ];
  measureList: Associatif[] = [
    { key: 'Kilogram', value: 'Kilogram' },
    { key: 'Meter', value: 'Meter' },
    { key: 'Liter', value: 'Liter' },
    { key: 'Tons', value: 'Tons' },
    { key: 'Unity', value: 'Unity' },
  ];
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private formBuilder: FormBuilder,
    private addressService: AddressService,

    private materialService: EquipmentService,
    private router: Router,
    private AuthenticateService: AuthenticateService
  ) {
    this.formAddMaterials = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]{2,}$')],
      ],
      measure: ['', [Validators.required]],

      status: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]{1,}$')]],
      dateOfPurshase: ['', [Validators.required]],
      category: ['', [Validators.required]],

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
      zipCode: [
        '',
        [Validators.required, Validators.pattern('^[a-z0-9]{4,}$')],
      ],
    });
    this.counrty?.setValue('Tunisie');

    this.city?.disable();
    this.collectStates();
  }

  ngOnInit() {
    this.counrty?.setValue('Tunisie');
  }

  create() {
    let address = new Address(
      HTMLEscape.escapeMethod(this.zipCode?.value),
      HTMLEscape.escapeMethod(this.street?.value),
      HTMLEscape.escapeMethod(this.city?.value),
      HTMLEscape.escapeMethod(this.state?.value),
      HTMLEscape.escapeMethod(this.counrty?.value),
      new Location(1, 1)
    );
    let totalquantity = new QuantityValue(
      this.quantity?.value,
      this.measure?.value
    );
    //  console.log(location)
    let material = new Material(null!,
      HTMLEscape.escapeMethod(String(this.name?.value)),
      HTMLEscape.escapeMethod(String(this.description?.value)),
      totalquantity,
      this.dateOfPurshase?.value,
      address,
      HTMLEscape.escapeMethod(String(this.category?.value)),
      HTMLEscape.escapeMethod(String(this.status?.value))
    );
    console.log(material);
    this.materialService.create(material).subscribe((data:any) => {
      console.log(data.message);
      Notify.success('Materiel est ajouté avec succès');
      this.router.navigate(['manager/materialList']);
    }),
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.AuthenticateService.redirectIfNotAuth();
        } else {
          Report.failure('Erreur', error.message, 'OK');
        }
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
  get name() {
    return this.formAddMaterials.get('name');
  }
  get category() {
    return this.formAddMaterials.get('category');
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
  get measure() {
    return this.formAddMaterials.get('measure');
  }
  get quantity() {
    return this.formAddMaterials.get('quantity');
  }
  check() {
    Object.keys(this.formAddMaterials.controls).forEach((key) => {
      if (this.formAddMaterials.get(key)!.errors) {
        if (
          this.formAddMaterials.get(key)!.errors!.hasOwnProperty('required')
        ) {
          Report.failure(key, 'Champs obligatoire', "D'accord");
        }
        if (this.formAddMaterials.get(key)!.errors!.hasOwnProperty('pattern')) {
          let stringAlpha: string = ' des lettres alphabétiques ';
          let stringdigit: string = ' des chiffres ';
          let stringMin: string = ' au minimum ';
          let stringMax: string = ' au maximum ';
          let stringOperation: string = String(
            this.formAddMaterials.get(key)!.errors!['pattern'].requiredPattern
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
