import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { plainToClass, plainToInstance } from 'class-transformer';
import moment from 'moment';
import { Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { Category } from 'src/app/models/Category';
import { Dbref } from 'src/app/models/dbref';
import { MaterialUsed } from 'src/app/models/resources/MaterialUsed';
import { QuantityValue } from 'src/app/models/resources/QuantityValue';
import { Team } from 'src/app/models/resources/team';
import { User } from 'src/app/models/user';
import { InterventionClosed } from 'src/app/models/works/interventionClosed';
import { IMaterial } from 'src/app/services/resources/material/imaterial';
import { Associatif } from 'src/app/services/types/associatif';
import { HTMLEscape } from 'src/app/services/validation/HTMLEscapeChars';
import { IIntervention } from 'src/app/services/works/intervention/iintervention';
import { interventionClosedService } from 'src/app/services/works/intervention/intervention-closed.service';
import { InterventionService } from 'src/app/services/works/intervention/intervention.service';

@Component({
  selector: 'app-close-intervention',
  templateUrl: './close-intervention.component.html',
  styleUrls: ['./close-intervention.component.css'],
})
export class CloseInterventionComponent implements OnInit {
  closeForm!: FormGroup;
  materialsUsedList: MaterialUsed[] = [];
  intervention!: IIntervention;
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
    private route: ActivatedRoute,
    private interServ: InterventionService,
    private router:Router,
    private interventionClosedServ: interventionClosedService
  ) {
    this.closeForm = this.formBuilder.group({
      description: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]{4,}$')],
      ],
      materialsUsed:this.formBuilder.array([]),
      members: ['', [Validators.required]],

    });
  }
  selectedItems: { item_id: number; item_text: string }[] = [];
  teamDropdownSettings!: {};

  ngOnInit() {
    // Setting of dropdown multiselect

    this.teamDropdownSettings = {
      singleSelection: false,

      idField: 'id',
      textField: 'firstName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',

      itemsShowLimit: 10,
      allowSearchFilter: true,
    };
    /***/
    if (this.route.snapshot.paramMap.has('id')) {
      this.findintervention();
    }
  }

  close() {
    let team = new Team(
      HTMLEscape.escapeMethod(String(this.intervention.team.name)),
      new Dbref(this.intervention.team.manager.getId()),
      Array.from(this.members?.value, (x: any) => new Dbref(x.id))
    );
    this.intervention.category = Object.assign(
      Category.prototype,
      this.intervention.category
    );

    let materialUsedValue:MaterialUsed[]=[]
    let i =0
    this.materialsUsed.controls.forEach(e=>{

      let m:MaterialUsed=this.materialsUsedList[i]
      if (m.getCategory()=="Matter") {
        m.setquantityToUse(new QuantityValue(Number(e.get('quantity')?.value),e.get('measure')?.value))

      }
      m.setDateOfPurchase(moment(m.getDateOfPurchase(),'DD-MM-yyyy').format("yyyy-MM-DD"))


      console.log(moment(m.getDateOfPurchase(),'DD-MM-yyyy').format("yyyy-MM-DD"))

      materialUsedValue.push(m)
      i+=1
    })

    this.intervention.materialsToBeUsed.forEach(m=>{
      m.setDateOfPurchase(moment(m.getDateOfPurchase(),'DD-MM-yyyy').format("yyyy-MM-DD"))

      console.log(m.getDateOfPurchase());

    })

    //  console.log(this.intervention.category.getId());

    let interventionClosed = new InterventionClosed(
      this.intervention.title,
      this.intervention.description,
      new Dbref(this.intervention.category.getId()!),
      this.intervention.address,
      String(this.intervention.startedAt),
      String(this.intervention.expiredAt),
      Array.from(this.intervention.demandList, (x: any) => new Dbref(x.id)),
      this.intervention.materialsToBeUsed,
      new Dbref(this.intervention.team.id),
      'Completed',
      HTMLEscape.escapeMethod(this.description?.value),
      null!,
      materialUsedValue,
      team
    );


    console.log(interventionClosed);

    this.interventionClosedServ
      .create(interventionClosed)
      .subscribe((res: any) => {
        if (res.status == true) {
          Report.success('Notification', res.message, 'ok');
          this.router.navigate(['/dashboard/manager/interventionClosedList']);

        }
      }),
      (errors: HttpErrorResponse) => {
        Report.failure('Error', errors.message, 'OK');
      };
  }
  findintervention() {
    this.interServ
      .findIntervention(String(this.route.snapshot.paramMap.get('id')))
      .subscribe((res: IIntervention) => {
        this.intervention = res;

        this.intervention.team.manager = plainToClass(User,this.intervention.team.manager);
        this.intervention.team.members = Array.from(res.team.members, (x) =>
          plainToClass(User, x)
        );
        this.intervention.materialsToBeUsed=Array.from(res.materialsToBeUsed,(x)=>x=plainToClass(MaterialUsed,x))
      console.log(this.intervention.materialsToBeUsed);

        this.members?.setValue(this.intervention.team.members);
        this.materialsUsedList = Array.from(
          this.intervention.materialsToBeUsed,
          (x) => x=plainToClass(MaterialUsed,x)
        );
        console.log(this.materialsUsedList);
        this.materialsUsedList.forEach((element) => {
          element.setquantityToUse(
            plainToClass(QuantityValue, element.getquantityToUse())
          );
          element.setTotalQuantity(
            plainToClass(QuantityValue, element.getTotalQuantity())
          );
          this.addMaterialUsed(element)
        });
      }),
      (error: HttpErrorResponse) => {
        Report.failure('Erreur', error.message, 'OK');
      };
  }
  input(item: any) {
    console.log(item);
  }
  get quantity() {
    return this.closeForm.get('quantity');
  }
  get measure() {
    return this.closeForm.get('measure');
  }
  get description() {
    return this.closeForm.get('description');
  }
  get members() {
    return this.closeForm.get('members');
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(JSON.stringify(items));
  }
  public get materialsUsed() :FormArray {
    return this.closeForm.get("materialsUsed") as FormArray
  }

  newMaterialUsed(v:QuantityValue): FormGroup {
    return this.formBuilder.group({
      quantity: [v.getquantityToUse(),[]],
      measure: [v.getMeasure(),[]],
    })
  }
  addMaterialUsed(material:MaterialUsed) {
    this.materialsUsed.push(this.newMaterialUsed(material.getquantityToUse()));
    if (material.getCategory()=="Material") {
      this.materialsUsed.controls[this.materialsUsed.length-1].get("quantity")?.disable()
      this.materialsUsed.controls[this.materialsUsed.length-1].get("measure")?.disable()
    }
  }
}
