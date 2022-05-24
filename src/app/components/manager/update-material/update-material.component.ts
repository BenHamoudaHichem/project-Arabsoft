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
import moment from 'moment';
import { plainToClass } from 'class-transformer';
import { Associatif } from 'src/app/services/types/associatif';
import { AddressService } from 'src/app/services/address/address.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { HTMLEscape } from 'src/app/services/validation/HTMLEscapeChars';

@Component({
  selector: 'app-update-material',
  templateUrl: './update-material.component.html',
  styleUrls: ['./update-material.component.css'],
})
export class UpdateMaterialComponent implements OnInit {
  public statusList: Associatif[] = [];
  id!: string;
  formupdateMaterials!: FormGroup;
  material!: IMaterial;
  states!: string[];
  cities!: string[];
  constructor(
    private ActivatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private materialService: EquipmentService,
    private addressService: AddressService,
    private router: Router,
    private AuthenticateService: AuthenticateService
  ) {
    this.formupdateMaterials = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      status: ['', [Validators.required]],

      dateOfPurshase: ['', [Validators.required]],

      description: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
      ],
      totalQuantity: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{1,}$')],
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
    this.counrty?.setValue('Tunisie');
    this.statusList.push({ key: 'Fonctionnel', value: 'Functional' });
    this.statusList.push({ key: 'En panne', value: 'Broken_down' });
    this.statusList.push({ key: 'Hors service', value: 'Expired' });
    this.statusList.push({ key: 'Volé', value: 'Stoled' });
    this.id = this.ActivatedRoute.snapshot.paramMap.get('id')!;
    //this.city?.disable();
    //this.collectStates();
  }

  ngOnInit() {
    this.findMaterial();
    console.log(this.id);
  }
  findMaterial() {
    this.counrty?.setValue('Tunisie');

    if (this.id != null) {
      this.materialService
        .findMaterial(this.id)
        .subscribe((data: IMaterial) => {
          // this.material = plainToClass(Material,data) ;
          //this.material.address = plainToClass(Address, data.address);

          console.log(this.material);

          this.name?.setValue(data.name);
          this.description?.setValue(data.description);
          this.dateOfPurshase?.setValue(
            moment(data.dateOfPurchase).format('yyyy-MM-DD')
          );
          this.counrty?.setValue(data.address.Country);

          this.state?.setValue(data.address.State);

          this.city?.setValue(this.material.address.City);

          this.street?.setValue(data.address.Street);
          this.zipCode?.setValue(data.address.ZipCode);
          this.statusList.forEach((element) => {
            if (element.value == this.material.status) {
              this.status?.setValue(element.value);
            }
          });
          //  this.status?.setValue(data.status);
        }),
        (error: HttpErrorResponse) => {
          if (error.status == 401) {
            this.AuthenticateService.redirectIfNotAuth();
          } else {
            Report.failure('Erreur', error.message, 'OK');
          }
        };
    }
  }
  update() {
    let address = new Address(
      HTMLEscape.escapeMethod(this.zipCode?.value),
      HTMLEscape.escapeMethod(this.street?.value),
      HTMLEscape.escapeMethod(this.city?.value),
      HTMLEscape.escapeMethod(this.state?.value),
      HTMLEscape.escapeMethod(this.counrty?.value),
      new Location(1, 1)
    );
    //  console.log(location)
    let newMaterial = new Material(
      HTMLEscape.escapeMethod(String(this.name?.value)),
      HTMLEscape.escapeMethod(String(this.description?.value)),
      this.totalQuantity?.value,

      address,
      this.dateOfPurshase?.value,
      HTMLEscape.escapeMethod(String(this.status?.value))
    );
    this.materialService
      .update(this.material.id, newMaterial)
      .subscribe((data: any) => {
        console.log(data);
        if (data.status) {
          Notify.success('Materiel est modifié avec succès');
          this.router.navigate([
            '/dashboard/manager/detailMaterial',
            this.material.id,
          ]);
        } else {
          Notify.failure(data.message);
        }
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
  get totalQuantity() {
    return this.formupdateMaterials.get('totalQuantity');
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
  check() {
    Object.keys(this.formupdateMaterials.controls).forEach((key) => {
      if (this.formupdateMaterials.get(key)!.errors) {
        console.log(this.formupdateMaterials.get(key)!.errors);
        if (
          this.formupdateMaterials.get(key)!.errors!.hasOwnProperty('required')
        ) {
          Report.failure(key, 'Champs obligatoire', "D'accord");
        }
        if (
          this.formupdateMaterials.get(key)!.errors!.hasOwnProperty('pattern')
        ) {
          let stringAlpha: string = ' des lettres alphabétiques ';
          let stringdigit: string = ' des chiffres ';
          let stringMin: string = ' au minimum ';
          let stringMax: string = ' au maximum ';
          let stringOperation: string = String(
            this.formupdateMaterials.get(key)!.errors!['pattern']
              .requiredPattern
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
