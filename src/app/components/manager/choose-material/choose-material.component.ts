import { LocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { plainToClass } from 'class-transformer';
import moment from 'moment';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Notify, Report } from 'notiflix';
import { Dbref } from 'src/app/models/dbref';
import { Material } from 'src/app/models/resources/Material';
import { MaterialUsed } from 'src/app/models/resources/MaterialUsed';
import { QuantityValue } from 'src/app/models/resources/QuantityValue';
import { Intervention } from 'src/app/models/works/intervention';
import { IMaterial } from 'src/app/services/resources/material/imaterial';
import { EquipmentService } from 'src/app/services/resources/material/material.service';
import { Associatif } from 'src/app/services/types/associatif';
import { InterventionService } from 'src/app/services/works/intervention/intervention.service';

@Component({
  selector: 'app-choose-material',
  templateUrl: './choose-material.component.html',
  styleUrls: ['./choose-material.component.css'],
})
export class ChooseMaterialComponent implements OnInit {
  materialForm!: FormGroup;
  materialsList!: IMaterial[];
  material!: IMaterial;
  selectedMaterialsUsed: MaterialUsed[] = [];
  dropdownSettings!: {};
  measureList: Associatif[] = [
    { key: 'Kilogram', value: 'Kilogram' },
    { key: 'Meter', value: 'Meter' },
    { key: 'Liter', value: 'Liter' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private materialService: EquipmentService,
    private router: Router,
    private interventionService: InterventionService,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {
    this.materialForm = this.formBuilder.group({
      measure: ['', [Validators.required]],
      materiel: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]{1,}$')]],
    });
    this.materialsAvailable();
  }

  selectedItems: { item_id: number; item_text: string }[] = [];

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true,
    };
  }
  onItemSelect(item: any) {
    console.log(item);
    this.materialService.findMaterial(item.id).subscribe((res: IMaterial) => {
      this.material = res;
      console.log(res);
    });
  }
  create() {
    let quantityToUse = new QuantityValue(
      this.quantity?.value,
      this.measure?.value
    );
    let materialToBeUsed = new MaterialUsed(
      this.material.id,
      this.material.name,
      this.material.description,
      this.material.totalQuantity,
      this.material.dateOfPurchase,
      this.material.address,
      this.material.category,
      this.material.status,
      quantityToUse,
      new Date()
    );
    console.log(materialToBeUsed);
    this.selectedMaterialsUsed.push(materialToBeUsed);
    let values: Intervention;
    values = JSON.parse(this.storage.get('intervention'));
    values = Object.assign(Intervention.prototype, values);
    console.log(values.getTitle());
    let intervention = new Intervention(
      values.getTitle(),
      values.getDescription(),
      values.getCategory(),
      values.getAddress(),
      values.getStartedAt(),
      values.getExpiredAt(),
      values.getDemandList(),
      this.selectedMaterialsUsed,
      values.getTeam(),
      values.getStatus()
    );
    //  console.log(intervention);
    this.interventionService.create(intervention).subscribe((data: any) => {
      console.log(data);
      if (data.status == true) {
        Notify.success(data.message);
        this.storage.remove('intervention');
        this.router.navigate(['/dashboard/manager/interventionList']);
      } else {
        Report.failure('Notification', data.message, 'OK');
      }
    }),
      (error: HttpErrorResponse) => {
        Report.warning('Erreur', error.message, 'OK');
      };
  }
  materialsAvailable() {
    this.materialService
      .allByStatus('Available')
      .subscribe((data: IMaterial[]) => {
        this.materialsList = data;
        console.log(this.materialsList);
      }),
      (error: HttpErrorResponse) => {
        Report.failure('Erreur', error.message, 'OK');
      };
  }
  get materiel() {
    return this.materialForm.get('materiel');
  }
  get quantity() {
    return this.materialForm.get('quantity');
  }
  get measure() {
    return this.materialForm.get('measure');
  }

  onSelectAll(items: any) {
    console.log(JSON.stringify(items));
  }

  check() {
    Object.keys(this.materialForm.controls).forEach((key) => {
      if (this.materialForm.get(key)!.errors) {
        if (this.materialForm.get(key)!.errors!.hasOwnProperty('required')) {
          Report.failure(key, 'Champs obligatoire', "D'accord");
        }
        if (this.materialForm.get(key)!.errors!.hasOwnProperty('pattern')) {
          let stringAlpha: string = ' des lettres alphabétiques ';
          let stringdigit: string = ' des chiffres ';
          let stringMin: string = ' au minimum ';
          let stringMax: string = ' au maximum ';
          let stringOperation: string = String(
            this.materialForm.get(key)!.errors!['pattern'].requiredPattern
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
  back() {
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  remove() {
    console.log('hi im remove photo ! ');
  }
  add() {
    console.log('hi im add photo ! ');
  }
}
