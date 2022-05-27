import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private interServ: InterventionService,
    private interventionClosedServ: interventionClosedService
  ) {
    this.closeForm = this.formBuilder.group({
      measure: ['', [Validators.required]],

      members: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]{1,}$')]],
      description: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]{4,}$')],
      ],
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
      null!,
      team
    );
    this.interventionClosedServ
      .create(interventionClosed)
      .subscribe((res: any) => {
        if (res.status == true) {
          Report.success('Notification', res.message, 'ok');
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

        this.intervention.team.manager = plainToClass(
          User,
          this.intervention.team.manager
        );
        this.intervention.team.members = Array.from(res.team.members, (x) =>
          plainToClass(User, x)
        );
        this.members?.setValue(this.intervention.team.members);
        this.materialsUsedList = Array.from(
          this.intervention.materialsToBeUsed,
          (x: MaterialUsed) => x
        );
        console.log(this.materialsUsedList);

        this.materialsUsedList.forEach((element) => {
          element.setquantityToUse(
            plainToClass(QuantityValue, element.getquantityToUse())
          );
          element.setTotalQuantity(
            plainToClass(QuantityValue, element.getTotalQuantity())
          );
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
}
