import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarMonthViewDay,
  CalendarView,
} from 'angular-calendar';
import { InterventionService } from 'src/app/services/works/intervention/intervention.service';
import { IIntervention } from 'src/app/services/works/intervention/iintervention';
import { HttpErrorResponse } from '@angular/common/http';
import moment from 'moment';
import { Address } from 'src/app/models/Address';
import { User } from 'src/app/models/user';
import { plainToClass } from 'class-transformer';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Category } from 'src/app/models/Category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Report } from 'notiflix';
import { Dbref } from 'src/app/models/dbref';
import { Intervention } from 'src/app/models/works/intervention';
import { DateValidation } from 'src/app/services/validation/DateValidation';
import { HTMLEscape } from 'src/app/services/validation/HTMLEscapeChars';
import { AddressService } from 'src/app/services/address/address.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { TeamService } from 'src/app/services/resources/team/team.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { ICategory } from 'src/app/services/category/icategory';
import { IMaterial } from 'src/app/services/resources/material/imaterial';
import { ITeam } from 'src/app/services/resources/team/iteam';
import { Associatif } from 'src/app/services/types/associatif';
import { IDemand } from 'src/app/services/works/demand/idemand';
import { ChooseMaterialComponent } from '../../manager/choose-material/choose-material.component';
import { Location } from 'src/app/models/Location';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;
  @ViewChild('modalIntervention', { static: true })
  modalIntervention!: TemplateRef<any>;
  @ViewChild('detailBackdrop')
detailView!: any;
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  displayModal=false;

  viewDate: Date = new Date();

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  refresh = new Subject<void>();


  activeDayIsOpen: boolean = true;
  btn: boolean = false;
  selectedMonthViewDay!: CalendarMonthViewDay;

  selectedDayViewDate!: Date;

  events: CalendarEvent[] = [];

  selectedDays: any[] = [];
  intervention!: IIntervention;
  locale!: string;
  // createComponent!: CreateInterventionComponent;
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
  sortedDays:any[]=[]
  statusList: Associatif[] = [
    { key: 'En attente', value: 'Waiting' },
    { key: 'En cours', value: 'In_Progress' },
  ];
  @ViewChild('app-choose-material', { static: false })
  ChooseMaterialComponent!: ChooseMaterialComponent;

  constructor(
    private modal: NgbModal,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private formBuilder: FormBuilder,
    private interventionService: InterventionService,
    private categoryService: CategoryService,
    private teamService: TeamService,
    private addressService: AddressService,
    private AuthenticateService: AuthenticateService
  ) {
    this.createInterventionForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
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
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9 -]{4,}$')]],
    });
    this.counrty?.setValue('Tunisie');

    this.city?.disable();
    this.collectStates();

    this.all();

    this.teamsAvailable();
  }

  ngOnInit(): void {
    this.interventionService.allByStatus('In_Progress').subscribe((res) => {
      //  console.log(res)
      res.body!.forEach((element: IIntervention) => {
        this.events.push({
          id: element.id,
          start: startOfDay(
            new Date(
              moment(element.startedAt, 'DD-MM-yyyy').format('yyyy-MM-DD')
            )
          ),
          end: endOfDay(
            new Date(
              moment(element.expiredAt, 'DD-MM-yyyy').format('yyyy-MM-DD')
            )
          ),

          title: element.title,
          color: colors.yellow,
          allDay: true,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: true,
        });
        this.viewDate = new Date();

        // console.log(this.events)
      });
    }),
      () => {
        //   console.log(errors)
      };
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (this.btn == false) {
      if (isSameMonth(date, this.viewDate)) {
        if (
          (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
          events.length === 0
        ) {
          this.activeDayIsOpen = false;
        } else {
          this.activeDayIsOpen = true;
        }
        this.viewDate = date;
      }
    }
  }

  handleEvent(event: CalendarEvent): void {
   //this.modal.dismissAll()
   //this.modal.open(this.modalContent, { size: 'xl' });
    //document.getElementById("close")!.click();
    this.displayModal=true
console.log(this.displayModal)
if(  this.displayModal==true)
    //this.detailView.open()
   {
    this.interventionService
    .findIntervention(String(event.id))
    .subscribe((res) => {
      this.intervention = res.body!;
      this.intervention.address = plainToClass(Address, res.body!.address);
      this.intervention.team.manager = plainToClass(
        User,
        res.body!.team.manager
      );
      this.intervention.category = plainToClass(Category, res.body!.category);
    }),
    (error:HttpErrorResponse)=>{Report.failure('Error calendar',error.message,'ok')}

   } }



  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  clickedDay(day: CalendarMonthViewDay): void {
    if (this.btn == true) {
      this.selectedMonthViewDay = day;
      console.log(this.selectedMonthViewDay);
      const selectedDateTime = this.selectedMonthViewDay.date.getTime();
      const dateIndex = this.selectedDays.findIndex(
        (selectedDay: any) => selectedDay.date.getTime() === selectedDateTime
      );
      if (dateIndex > -1) {
        delete this.selectedMonthViewDay.cssClass;
        this.selectedDays.splice(dateIndex, 1);
      } else {
        this.selectedDays.push(this.selectedMonthViewDay);
        day.cssClass = 'cal-day-selected';
        console.log(this.selectedDays);
        this.selectedMonthViewDay = day;

   this.sortedDays=this.selectedDays.sort((a,b)=>moment(a.date,'yyyy-MM-DD' ).diff(moment(b.date,'yyyy-MM-DD') ))
    /*  console.log(this.sortedDays)
      console.log(moment(this.sortedDays[0].date).format('DD-MM-yyyy'))
      console.log(moment(this.sortedDays[this.sortedDays.length-1].date).format('DD-MM-yyyy'))*/
      }
    }
  }
  changeStatus() {
    return (this.btn = true);
  }
  clear() {
    this.btn = false;
    this.selectedDays = [];
  //  delete this.selectedMonthViewDay.cssClass;
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
  openInterventionModal() {
  //  this.modal.open(this.modalIntervention,{ size: 'xl' });

  //  console.log( this.modal.open(this.modalIntervention, { size: 'xl' }))
    this.date?.setValue(moment(this.sortedDays[0].date,"DD-MM-yyyy").format("yyyy-MM-DD"))
    this.endDate?.setValue(moment(this.sortedDays[this.sortedDays.length-1].date,"DD-MM-yyyy").format("yyyy-MM-DD"))
  }

  /*****intervention */
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(JSON.stringify(items));
  }

  teamsAvailable() {
    this.teamService.allByStatus('Available').subscribe((res) => {
      this.teamList = res.body!;
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
    this.categoryService.all().subscribe((res) => {
      this.categoryList = res.body!;
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
      undefined,
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
  checkExpiredAt() {
    if (this.date?.valid) {
      this.endDate?.clearValidators();
      this.endDate?.addValidators([
        Validators.required,
        DateValidation.isBefor(moment(this.date?.value, 'yyyy-MM-DD').toDate()),
      ]);
      this.endDate?.updateValueAndValidity();
    }
  }
  checkStartedAtAt() {
    if (this.endDate?.valid) {
      this.date?.clearValidators();
      this.date?.addValidators([
        Validators.required,
        DateValidation.isAfter(
          moment(this.endDate?.value, 'yyyy-MM-DD').toDate()
        ),
      ]);
      this.date?.updateValueAndValidity();
    }
  }
}
