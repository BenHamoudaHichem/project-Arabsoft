import { HttpErrorResponse } from '@angular/common/http';
import { Component, ErrorHandler, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { plainToClass } from 'class-transformer';
import moment from 'moment';
import { Notify, Report } from 'notiflix';
import { finalize } from 'rxjs';
import { Address } from 'src/app/models/Address';
import { Dbref } from 'src/app/models/dbref';
import { Location } from 'src/app/models/Location';
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

@Component({
  selector: 'app-create-intervention',
  templateUrl: './create-intervention.component.html',
  styleUrls: ['./create-intervention.component.css'],
})
export class CreateInterventionComponent implements OnInit {
  states!:string[]
  cities!:string[]
  createInterventionForm!: FormGroup;
  currentDemand!:IDemand
  demandList: Dbref[] = [];
  categoryList: ICategory[]=[]
  interventionList!: IIntervention[];
  materialsList!: IMaterial[];
  teamList: ITeam[]=[];
  statusList:Associatif[]=[{key:'En attente',value:"Waiting"},{key:'En cours',value:'In_Progress'}]
  constructor(
    private formBuilder: FormBuilder,
    private interventionService: InterventionService,
    private categoryService: CategoryService,
    private teamService: TeamService,
    private demandService :DemandService,
    private materialService: EquipmentService,
    private addressService:AddressService,
    private router: Router,
    private route: ActivatedRoute,
    private AuthenticateService:AuthenticateService
  ) {
    this.createInterventionForm = this.formBuilder.group(
      {
        title: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
        ],
        description: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z ]{8,}$')],
        ],
        category: ['', [Validators.required]],
        date: ['', [Validators.required]],
        status: ['', [Validators.required]],
        team: ['', [Validators.required]],
        Materiel: ['', [Validators.required]],
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
        zipCode: ['', [Validators.required, Validators.pattern('^[0-9 -]{4,}$')]],

      },
      {
        validators: DateValidation.DateConfirmation(
          'date',
          new Date('2019-12-07')
        ),
      }
    );
    this.counrty?.setValue("Tunisie")

    this.city?.disable()
    this.collectStates()

  }

  dropdownSettings!: {};
  ngOnInit() {
this.counrty?.setValue('Tunisie')

    this.demandList = new Array(new Dbref(this.route.snapshot.paramMap.get('id')!));
    this.allCategory();
    this.getMaterials();

    console.log(this.categoryList)
    this.Teams();
    this.demandService.showDemande(this.route.snapshot.paramMap.get('id')!).pipe(finalize(()=>this.currentDemand.title===undefined)).subscribe((res:IDemand)=>{
      this.currentDemand=res as IDemand;
      this.currentDemand.address=plainToClass(Address,res.address)
      console.log(this.currentDemand)
      this.state?.setValue(this.currentDemand.address.State)
      this.zipCode?.setValue(this.currentDemand.address.ZipCode)
      this.city?.setValue(this.currentDemand.address.City)
      this.street?.setValue(this.currentDemand.address.Street)
      this.counrty?.setValue(this.currentDemand.address.Country)
      this.currentDemand.user=plainToClass(User,res.user)
    }),(error:HttpErrorResponse)=>{
      if(error.status==401){
        this.AuthenticateService.redirectIfNotAuth()

      } else{
        Report.failure('Erreur', error.message,'OK')

      }
    };
    this.dropdownSettings = {
      singleSelection: false,
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

  Teams() {
    this.teamService.findByStatus("Available").subscribe((data: ITeam[]) => {
      this.teamList = data;
      console.log(this.teamList);
      this.teamList.forEach(item => {
        item.manager=plainToClass(User,item.manager)

        item.manager.setAddress(plainToClass(Address,item.manager.getAddress()))
        item.members.forEach(subItem => {
          subItem=plainToClass(User,subItem)
          subItem.setAddress(plainToClass(Address,subItem.getAddress()))

        });
      });
    }),
      (errors: HttpErrorResponse) => {
        Report.failure('erreur getting Teams', errors.message, 'Ok');
      };
  }
  getMaterials() {
    this.materialService.materialPerStatus("Available").subscribe((data: IMaterial[]) => {
      this.materialsList = data;
      console.log(this.materialsList);
    }),
      (error: HttpErrorResponse) => {
        if(error.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        }else{
          Report.failure('Erreur', error.message,'OK')

        }}
  }

  allCategory() {
    this.categoryService.all().subscribe((data: ICategory[]) => {
      this.categoryList = data;
      console.log(this.categoryList);
    }),
      (errors: HttpErrorResponse) => {
        if(errors.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        } else{
          Report.failure('Erreur', errors.message,'OK')

        }          };
  }

  create() {
    // console.log(this.createInterventionForm.value)
    console.log(this.Materiel?.value);
    Array.from(this.Materiel?.value as IMaterial[], (x) => x.id);
    let intervention = new Intervention(
      HTMLEscape.escapeMethod(this.title?.value),
      HTMLEscape.escapeMethod(this.description?.value),
      new Dbref(this.category?.value),
      new Address(
        HTMLEscape.escapeMethod(this.zipCode?.value),
        HTMLEscape.escapeMethod(this.street?.value)
        ,
        HTMLEscape.escapeMethod(this.city?.value)
        ,
        HTMLEscape.escapeMethod(this.state?.value),
        HTMLEscape.escapeMethod(this.counrty?.value),
        new Location(0,0)),
      moment(this.date?.value).format("DD-MM-yyyy"),
      this.demandList,
      Array.from(this.Materiel?.value as any[], (x) => new Dbref(x.id)),

      new Dbref(this.team?.value),
      this.status?.value
    );
    console.log(JSON.stringify(intervention));
      this.interventionService.create(intervention).subscribe((data: any) => {
      console.log(data);
      if (data.status == true) {
        Report.success('Notification', data.message, 'OK');
        this.router.navigate(['/dashboard/manager/interventionList']);
      } else {
        Report.success('Notification', data.message, 'OK');
      }
    }),
      (error: HttpErrorResponse) => {
        if(error.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        } else{
          Report.failure('Erreur', error.message,'OK')

        }          }
  }

  getInterventions() {
    /*
    this.interventionService.all().subscribe((res: IIntervention[]) => {
      this.interventionList = res;
    }),
      (error: HttpErrorResponse) => {
        Report.failure('erreur getting interventions', error.message, 'ok');
      };*/
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
  get team() {
    return this.createInterventionForm.get('team');
  }
  get Materiel() {
    return this.createInterventionForm.get('Materiel');
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


  chechIsNow(){
    if(this.status?.value==this.statusList[1].value)
    {
      this.date?.setValue(moment(new Date()).format('yyyy-MM-DD'))
    }
  }
}
