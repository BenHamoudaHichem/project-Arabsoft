import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { plainToClass, plainToInstance } from 'class-transformer';
import moment from 'moment';
import { Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { Category } from 'src/app/models/Category';
import { Material } from 'src/app/models/resources/Material';
import { MaterialUsed } from 'src/app/models/resources/MaterialUsed';
import { User } from 'src/app/models/user';
import { Demand } from 'src/app/models/works/demand';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { MapService } from 'src/app/services/map/map.service';
import { ITeam } from 'src/app/services/resources/team/iteam';
import { IDemand } from 'src/app/services/works/demand/idemand';
import { IIntervention } from 'src/app/services/works/intervention/iintervention';
import { InterventionService } from 'src/app/services/works/intervention/intervention.service';

@Component({
  selector: 'app-detail-intervention',
  templateUrl: './detail-intervention.component.html',
  styleUrls: ['./detail-intervention.component.css'],
})
export class DetailInterventionComponent implements OnInit {
  id!: string;
  intervention!: IIntervention;
  status!: string;
  percent!:number
  stylPercent!:string

  ITeam!: ITeam[];
  constructor(
    private interventionService: InterventionService,
    private AuthenticateService: AuthenticateService,
    private route: ActivatedRoute,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.findIntervention(String(this.route.snapshot.paramMap.get('id')));

  }


  findIntervention(id: string) {
    this.interventionService
      .findIntervention(id)
      .subscribe((res) => {

        this.intervention = res.body!;
        this.intervention.address = plainToClass(
          Address,
          this.intervention.address
        );
        if (this.intervention.status == 'In_Progress') {
          this.status = 'En cours';
        }
        if (this.intervention.status == 'Waiting') {
          this.status = 'En attente';
        }
        this.intervention.team.manager = plainToClass(
          User,
          this.intervention.team.manager
        );
        this.intervention.team.members = Array.from(res.body!.team.members, (x) =>
          plainToClass(User, x)
        );
      this.intervention.demandList = Array.from(res.body!.demandList, (x) =>
      x=x as IDemand
    );
    this.intervention.demandList.forEach((element) => {
      element.user = plainToClass(User,element.user);
      element.user.setAddress(
        plainToClass(Address, element.user.getAddress())
      );
      element.address = plainToClass(Address, element.address);
    });


        this.intervention.category = plainToClass(
          Category,
          this.intervention.category
        );
        this.intervention.materialsToBeUsed = Array.from(res.body!.materialsToBeUsed, (x) =>
        plainToClass(MaterialUsed, x)
      );
      this.intervention.materialsToBeUsed.forEach(e=>{
        e.setaddress(plainToClass(Address,e.getaddress()))
      })



this.percent=((Date.now()-moment(this.intervention.startedAt,"DD-MM-yyyy").toDate().getTime())/(moment(this.intervention.expiredAt,"DD-MM-yyyy").toDate().getTime()-moment(this.intervention.startedAt,"DD-MM-yyyy").toDate().getTime()))*100;

if (this.percent>100) {
  Report.warning("Date d'expiration","Cette intervention est dépassée le date d'expiration!","D'accord")
}
console.log(this.percent);

this.stylPercent="width: "+this.percent+"%;"
this.mapService.findLocation(this.intervention.address.Location());
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
