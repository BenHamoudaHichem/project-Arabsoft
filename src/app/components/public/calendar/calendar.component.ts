import { Component, Inject, OnInit } from '@angular/core';
import {

  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
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
import { ChangeDetectionStrategy } from '@angular/compiler';
import { Category } from 'src/app/models/Category';

const colors:any = {
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
  styleUrls: ['./calendar.component.css']

})
export class CalendarComponent implements OnInit {


  events: CalendarEvent[]=[]
  intervention!: IIntervention;
  locale!:string

  constructor(private modal: NgbModal, private interventionService:InterventionService,
    @Inject(SESSION_STORAGE) private storage: StorageService) {



  }

  ngOnInit(): void {
    this.interventionService.allByStatus('In_Progress').subscribe((res)=>{
    //  console.log(res)
      res.body!.forEach((element: IIntervention) => {
        this.events.push(
          {
            id: element.id,
            start:startOfDay(new Date(moment(element.startedAt,"DD-MM-yyyy").format("yyyy-MM-DD"))),
            end:endOfDay(new Date(moment(element.expiredAt,"DD-MM-yyyy").format("yyyy-MM-DD"))),

            title: element.title,
            color: colors.yellow,
            allDay: true,
            resizable: {
            beforeStart: true,
            afterEnd: true,
            },
            draggable: true,
          }
        );    this.viewDate = new Date();

       // console.log(this.events)
      });

    }),
    (errors:HttpErrorResponse)=>{
   //   console.log(errors)
    }
  }
  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData!: {
    action: string;
    event: CalendarEvent;
  };



  refresh = new Subject<void>();
setInterventions(){

}

  activeDayIsOpen: boolean = true;


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
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


  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
   this.interventionService.findIntervention(String(event.id)).subscribe((res)=>{
      this.intervention=res.body!
      this.intervention.address = plainToClass( Address,res.body!.address)
      this.intervention.team.manager = plainToClass(User,res.body!.team.manager)
      this.intervention.category=plainToClass(Category,res.body!.category)

   })
  }



  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event: CalendarEvent<any>) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
