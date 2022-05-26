import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { Category } from 'src/app/models/Category';
import { QuantityValue } from 'src/app/models/resources/QuantityValue';
import { User } from 'src/app/models/user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { MapService } from 'src/app/services/map/map.service';
import { ITeam } from 'src/app/services/resources/team/iteam';
import { IIntervention } from 'src/app/services/works/intervention/iintervention';
import { IInterventionClosed } from 'src/app/services/works/intervention/iinterventionClosed';
import { interventionClosedService } from 'src/app/services/works/intervention/intervention-closed.service';
import { InterventionService } from 'src/app/services/works/intervention/intervention.service';

@Component({
  selector: 'app-detail-intervention-closed',
  templateUrl: './detail-intervention-closed.component.html',
  styleUrls: ['./detail-intervention-closed.component.css']
})
export class DetailInterventionClosedComponent implements OnInit {
  id!: string;
  intervention!: IInterventionClosed;
  ITeam!: ITeam[];
  constructor(
    private interventionService: interventionClosedService,
    private AuthenticateService: AuthenticateService,
    private route: ActivatedRoute,
    private mapService: MapService
  ) {}
  ngOnInit(): void {
    this.findIntervention(String(this.route.snapshot.paramMap.get('id')));
  }


  findIntervention(id: string) {
    this.interventionService
      .findById(id)
      .subscribe((res: IInterventionClosed) => {
        this.intervention = res;
        this.intervention.address = plainToClass(
          Address,
          this.intervention.address
        );

        this.intervention.workingGroup.manager = plainToClass(
          User,
          this.intervention.workingGroup.manager
        );
        this.intervention.workingGroup.members = Array.from(res.workingGroup.members, (x) =>
          plainToClass(User, x)
        );
        this.intervention.demandList.forEach((element) => {
          element.user = plainToClass(User,element.user);
          element.user.setAddress(
            plainToClass(Address, element.user.getAddress())
          );
          element.address = plainToClass(Address, element.address);
        });

        this.intervention.materialList.forEach((element) => {
          element.quantityToUse = plainToClass(QuantityValue, element.quantityToUse);
        });
        this.intervention.category = plainToClass(
          Category,
          this.intervention.category
        );
        console.log(this.intervention);

console.log(this.intervention.address.Location())
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
