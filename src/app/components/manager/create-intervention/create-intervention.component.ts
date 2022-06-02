import { LocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ErrorHandler, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { plainToClass } from 'class-transformer';
import moment from 'moment';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Notify, Report } from 'notiflix';
import { finalize } from 'rxjs';
import { Address } from 'src/app/models/Address';
import { Dbref } from 'src/app/models/dbref';
import { Location } from 'src/app/models/Location';
import { MaterialUsed } from 'src/app/models/resources/MaterialUsed';
import { User } from 'src/app/models/user';
import { Intervention } from 'src/app/models/works/intervention';
import { AddressService } from 'src/app/services/address/address.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { ICategory } from 'src/app/services/category/icategory';
import { IMaterial } from 'src/app/services/resources/material/imaterial';
import { EquipmentService } from 'src/app/services/resources/material/material.service';
import { ITeam } from 'src/app/services/resources/team/iteam';
import { TeamService } from 'src/app/services/resources/team/team.service';
import { Associatif } from 'src/app/services/types/associatif';
import { DateValidation } from 'src/app/services/validation/DateValidation';
import { HTMLEscape } from 'src/app/services/validation/HTMLEscapeChars';
import { DemandService } from 'src/app/services/works/demand/demand.service';
import { IDemand } from 'src/app/services/works/demand/idemand';
import { IIntervention } from 'src/app/services/works/intervention/iintervention';
import { InterventionService } from 'src/app/services/works/intervention/intervention.service';
import { ChooseMaterialComponent } from '../choose-material/choose-material.component';

@Component({
  selector: 'app-create-intervention',
  templateUrl: './create-intervention.component.html',
  styleUrls: ['./create-intervention.component.css'],
})
export class CreateInterventionComponent implements OnInit {
  states!: string[];
  cities!: string[];
  createInterventionForm!: FormGroup;
  currentDemand!: IDemand;
  demandList: Dbref[] = [];
  categoryList: ICategory[] = [];
  interventionList!: IIntervention[];
  materialsList!: IMaterial[];
  teamList: ITeam[] = [];
  output: boolean = false;
  statusList: Associatif[] = [
    { key: 'En attente', value: 'Waiting' },
    { key: 'En cours', value: 'In_Progress' },
  ];
  @ViewChild('app-choose-material', { static: false })
  ChooseMaterialComponent!: ChooseMaterialComponent;



  constructor(
    private formBuilder: FormBuilder,
    private interventionService: InterventionService,
    private categoryService: CategoryService,
    private teamService: TeamService,
    private demandService: DemandService,
    private materialService: EquipmentService,
    private addressService: AddressService,
    private router: Router,
    private route: ActivatedRoute,
    private AuthenticateService: AuthenticateService,
    private location: LocationStrategy,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {
      this.createInterventionForm = this.formBuilder.group(
      {
        title: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
        ],
        description: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z ]{4,}$')],
        ],
        category: ['', [Validators.required]],
        date: ['', [Validators.required]],

        endDate: ['', [Validators.required]],
        status: ['', [Validators.required]],
        team: ['', [Validators.required]],
        state: ['', [Validators.required]],
        city: ['', [Validators.required]],
        street: ['', [Validators.required]],
        country: ['', [Validators.required]],
        zipCode: [
          '',
          [Validators.required, Validators.pattern('^[0-9 -]{4,}$')],
        ],
      },
    );
    this.counrty?.setValue('Tunisie');

    this.city?.disable();
    this.collectStates();

    this.all();

    this.teamsAvailable();

  }

  dropdownSettings!: {};
  ngOnInit() {

    this.demandList = new Array(
      new Dbref(this.route.snapshot.paramMap.get('id')!)
    );

    this.teamsAvailable();
    this.demandService
      .findDemand(this.route.snapshot.paramMap.get('id')!)
      //.pipe(finalize(() => this.currentDemand.title === undefined))
      .subscribe((res: IDemand) => {
        this.currentDemand = res;
        this.currentDemand.address = plainToClass(Address, res.address);

       // console.log(this.currentDemand);
        this.state?.setValue(this.currentDemand.address.State);
        this.zipCode?.setValue(this.currentDemand.address.ZipCode);
        this.city?.setValue(this.currentDemand.address.City);
        this.street?.setValue(this.currentDemand.address.Street);
        this.counrty?.setValue(this.currentDemand.address.Country);
        this.currentDemand.user = plainToClass(User, res.user);
        this.date?.addValidators([Validators.required,DateValidation.isBefor(res.createdAt)])
        this.date?.updateValueAndValidity()
      }),
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.AuthenticateService.redirectIfNotAuth();
        } else {
          Report.failure('Erreur', error.message, 'OK');
        }
      };
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
  }
  onSelectAll(items: any) {
    console.log(JSON.stringify(items));
  }

  teamsAvailable() {
    this.teamService.allByStatus('Available').subscribe((data: ITeam[]) => {
      this.teamList = data;
      this.teamList.forEach((item) => {
        item.manager = plainToClass(User, item.manager);

        item.manager.setAddress(
          plainToClass(Address, item.manager.getAddress())
        );
        item.members.forEach((subItem) => {
          subItem = plainToClass(User, subItem);
          subItem.setAddress(plainToClass(Address, subItem.getAddress()));
        });
      });
    }),
      (errors: HttpErrorResponse) => {
        Report.failure('erreur getting Teams', errors.message, 'Ok');
      };
  }


  all() {
    this.categoryService.all().subscribe((data: ICategory[]) => {
      this.categoryList = data;
    }),
      (errors: HttpErrorResponse) => {
        if (errors.status == 401) {
          this.AuthenticateService.redirectIfNotAuth();
        } else {
          Report.failure('Erreur', errors.message, 'OK');
        }
      };
  }

  create() {
    let intervention = new Intervention(
      HTMLEscape.escapeMethod(this.title?.value),
      HTMLEscape.escapeMethod(this.description?.value),
      new Dbref(this.category?.value),
      new Address(
        HTMLEscape.escapeMethod(this.zipCode?.value),
        HTMLEscape.escapeMethod(this.street?.value),
        HTMLEscape.escapeMethod(this.city?.value),
        HTMLEscape.escapeMethod(this.state?.value),
        HTMLEscape.escapeMethod(this.counrty?.value),
        new Location(0, 0)
      ),
      moment(this.date?.value).format('DD-MM-yyyy'),

      moment(this.endDate?.value).format('DD-MM-yyyy'),
      this.demandList,
      null!,
      new Dbref(this.team?.value),
      this.status?.value
    );
    this.storage.set('intervention', JSON.stringify(intervention));
    this.output = true;


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
  get title() {
    return this.createInterventionForm.get('title');
  }
  get description() {
    return this.createInterventionForm.get('description');
  }
  get category() {
    return this.createInterventionForm.get('category');
  }
  get date() {
    return this.createInterventionForm.get('date');
  }
  get endDate() {
    return this.createInterventionForm.get('endDate');
  }
  get team() {
    return this.createInterventionForm.get('team');
  }

  get status() {
    return this.createInterventionForm.get('status');
  }

  get city() {
    return this.createInterventionForm.get('city');
  }
  get state() {
    return this.createInterventionForm.get('state');
  }
  get street() {
    return this.createInterventionForm.get('street');
  }
  get counrty() {
    return this.createInterventionForm.get('country');
  }
  get zipCode() {
    return this.createInterventionForm.get('zipCode');
  }

  chechIsNow() {
    if (this.status?.value == this.statusList[1].value) {
      this.date?.setValue(moment(new Date()).format('yyyy-MM-DD'));
    }
  }

  check() {
    Object.keys(this.createInterventionForm.controls).forEach((key) => {
      if (this.createInterventionForm.get(key)!.errors) {
      //  console.log(this.createInterventionForm.get(key)!.errors);
        if (
          this.createInterventionForm
            .get(key)!
            .errors!.hasOwnProperty('required')
        ) {
          Report.failure(key, 'Champs obligatoire', "D'accord");
        }
        if (
          this.createInterventionForm
            .get(key)!
            .errors!.hasOwnProperty('pattern')
        ) {
          let stringAlpha: string = ' des lettres alphabétiques ';
          let stringdigit: string = ' des chiffres ';
          let stringMin: string = ' au minimum ';
          let stringMax: string = ' au maximum ';
          let stringOperation: string = String(
            this.createInterventionForm.get(key)!.errors!['pattern']
              .requiredPattern
          );
        //  console.log(stringOperation);

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
  checkExpiredAt()
  {
    if (this.date?.valid) {
      this.endDate?.clearValidators()
      this.endDate?.addValidators([Validators.required,DateValidation.isBefor(moment(this.date?.value,'yyyy-MM-DD').toDate())])
      this.endDate?.updateValueAndValidity()

    }
  }
  checkStartedAtAt()
  {
    if (this.endDate?.valid) {

      this.date?.clearValidators()
      this.date?.addValidators([Validators.required,DateValidation.isAfter(moment(this.endDate?.value,'yyyy-MM-DD').toDate())])
      this.date?.updateValueAndValidity()


    }
  }

}
