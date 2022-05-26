import { InfoWindowManager } from '@agm/core';
import { WindowRef } from '@agm/core/lib/utils/browser-globals';
import { LocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import EventEmitter from 'events';
import { Report } from 'notiflix';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { IMaterial } from 'src/app/services/resources/material/imaterial';
import { EquipmentService } from 'src/app/services/resources/material/material.service';
import { TeamService } from 'src/app/services/resources/team/team.service';
import { Associatif } from 'src/app/services/types/associatif';
import { IUser } from 'src/app/services/user/iuser';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-choose-material',
  templateUrl: './choose-material.component.html',
  styleUrls: ['./choose-material.component.css'],
})
export class ChooseMaterialComponent implements OnInit {
  materialForm!: FormGroup;
  materialsList!: IMaterial[];

  dropdownSettings!: {};
  measureList: Associatif[] = [
    { key: 'Kilogram', value: 'Kilogram' },
    { key: 'Meter', value: 'Meter' },
    { key: 'Liter', value: 'Liter' },
  ];
  output: any;

  constructor(
    private formBuilder: FormBuilder,
    private materialService: EquipmentService,
    private location: LocationStrategy
  ) {
    this.materialForm = this.formBuilder.group({
      measure: ['', [Validators.required]],
      materiel: ['', [Validators.required]],

      quantity: ['', [Validators.required, Validators.pattern('^[0-9]{1,}$')]],
    });
  }

  selectedItems: { item_id: number; item_text: string }[] = [];

  ngOnInit() {
    // Setting of dropdown multiselect
    this.materialsAvailable();
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

  create() {
    // Array.from(this.Materiel?.value as IMaterial[], (x) => x.id);
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
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(JSON.stringify(items));
  }

  check() {
    Object.keys(this.materialForm.controls).forEach((key) => {
      if (this.materialForm.get(key)!.errors) {
        console.log(this.materialForm.get(key)!.errors);
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

  remove(){
    console.log("hi im remove photo ! ")
  }
  add(){
    console.log("hi im add photo ! ")
  }
}
