import { LocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { ht } from 'date-fns/locale';
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
  totalQuantityValues:number[]=[]
  private intervention_1: Intervention = Object.assign(Intervention.prototype, JSON.parse(this.storage.get('intervention')))
  materialsList!: IMaterial[];
  imaterial!: IMaterial;
  selectedMaterialsUsed: MaterialUsed[] = [];
  dropdownSettings!: {};
  measureList: Associatif[] = [
    { key: 'Kilogram', value: 'Kilogram' },
    { key: 'Meter', value: 'Meter' },
    { key: 'Liter', value: 'Liter' },
    { key: 'Tons', value: 'Tons' },
    { key: 'Unity', value: 'Unity' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private materialService: EquipmentService,
    private router: Router,
    private interventionService: InterventionService,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {
    this.materialForm = this.formBuilder.group({
      materialsUsed:this.formBuilder.array([]),
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
    console.log(this.intervention_1);

  }
  onItemSelect(item: any) {
    console.log(item);

    this.materialService.findMaterial(item.id).subscribe((res) => {
      this.imaterial = res.body!;
      console.log(res);
    });

    for (let index = 0; index < this.materialsList.length; index++) {
      const element:IMaterial = this.materialsList[index];


      if (element.id==item.id) {

      document.getElementsByName("total")[this.materialsUsed.length-1].innerText=String(element.totalQuantity.getquantityToUse())

        this.totalQuantityValues.push(element.totalQuantity.getquantityToUse())
        this.setFormArrayValueX(element.totalQuantity)
        this.materialsList.splice(index,1)
        break
      }
    }
  }
  create() {

    this.selectedMaterialsUsed=[]

    this.materialsAvailable()
    this.materialsUsed.controls.forEach(element => {
      console.log(this.materialsList[0].id);
      console.log(element.get('material')?.value[0].id)
      let m:IMaterial=this.materialsList.find(x=>x.id==element.get('material')?.value[0].id)!
      let quantityToUse = new QuantityValue(
        Number(element.get('quantity')?.value),element.get('measure')?.value
      );
      this.selectedMaterialsUsed.push(new MaterialUsed(
        m.id,
        m.name,
        m.description,
        m.totalQuantity,
        m.dateOfPurchase,
        m.address,
        m.category,
        m.status,
        quantityToUse,
        new Date()
      ))

    });
    let values: Intervention;
    values = JSON.parse(this.storage.get('intervention'));
    values = Object.assign(Intervention.prototype, values);


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
     console.log(intervention);

    this.interventionService.create(intervention).subscribe((data: any) => {
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
        this.storage.set("materials",JSON.stringify(data))
      }),
      (error: HttpErrorResponse) => {
        Report.failure('Erreur', error.message, 'OK');
      };
      this.materialsList=JSON.parse(this.storage.get("materials")) as IMaterial[]
      this.materialsList.forEach(e=>{
        e.totalQuantity=plainToClass(QuantityValue,e.totalQuantity)
      })
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
  public get materialsUsed() :FormArray {
    return this.materialForm.get("materialsUsed") as FormArray
  }
  newMaterialUsed(): FormGroup {
    /*if (this.materialsUsed.length>0) {
      this.materialsList.filter(m=>{m})

    }*/
    return this.formBuilder.group({
      material:['',[Validators.required]],
      quantity: ['',[Validators.required]],
      measure: ['',[Validators.required]],
    })
  }
  addMaterialUsed() {


    this.materialsUsed.push(this.newMaterialUsed());

  }
  removeMaterialUsed(i:number) {
    this.materialsUsed.removeAt(i);

    if (this.materialsUsed.length==0){

      this.materialsAvailable()
    }

  }
  getTotalQuantity(i:number):number{

    if (this.materialsUsed.length===0) {
      return 0
    }
     return this.totalQuantityValues[i]
     //this.materialsList[i].totalQuantity.getquantityToUse()
  }
  public quantity(i:number) : AbstractControl | null {
    return this.materialsUsed.controls[i].get("quantity")
  }
  public measure(i:number) : AbstractControl | null {
    return this.materialsUsed.controls[i].get("measure")
  }
  public material(i:number) : AbstractControl | null {
    return this.materialsUsed.controls[i].get("material")
  }


  public setFormArrayValueX(q:QuantityValue) {

    this.quantity(this.materialsUsed.controls.length-1)?.addValidators(Validators.max(q.getquantityToUse()))

    this.measure(this.materialsUsed.controls.length-1)?.setValue(q.getMeasure())
    if (q.getMeasure()=="Unity") {

      this.measure(this.materialsUsed.controls.length-1)?.disable()
    }

  }

}
