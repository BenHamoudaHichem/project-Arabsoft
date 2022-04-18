import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { Category } from 'src/app/models/Category';
import { User } from 'src/app/models/user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { HomeLoaderService } from 'src/app/services/home/home-loader.service';
import { IHomeManager } from 'src/app/services/home/ihome-manager';
import { ITeam } from 'src/app/services/resources/team/iteam';
import { TeamService } from 'src/app/services/resources/team/team.service';
import { IIntervention } from 'src/app/services/works/intervention/iintervention';
import { InterventionService } from 'src/app/services/works/intervention/intervention.service';

@Component({
  selector: 'app-home-manager',
  templateUrl: './home-manager.component.html',
  styleUrls: ['./home-manager.component.css'],
})
export class HomeManagerComponent implements OnInit {
  infos!: IHomeManager;
  teamList!: ITeam[];
  interventionList!: IIntervention[];
  constructor(
    private homeLoaderService: HomeLoaderService,
    private teamService: TeamService,
    private authService: AuthenticateService,
    private serviceIntervention: InterventionService
  ) {
    this.homeLoaderService
      .loadHomeForManager()
      .subscribe((res: IHomeManager) => {
        this.infos = res;
        console.log(this.infos);
      });
    console.log(this.authService.isLogin);

  }

  ngOnInit(): void {this.showPerStatus('In_Progress')}
  TeamsArray() {
    this.teamService.all().subscribe((IT: ITeam[]) => {
      this.teamList = IT;
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

      console.log(this.teamList);
    }),
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.authService.redirectIfNotAuth();
        } else {
          Report.failure('Erreur', error.message, 'OK');
        }
      };
  }
  displayStatus(status: string): string {
    if (status == 'Available') {
      return 'Disponible';
    }
    return 'Indisponible';
  }
  showPerStatus(status: string) {
    this.interventionList = [];
    this.serviceIntervention
      .interventionPerStatus(status)
      .subscribe((res: IIntervention[]) => {
        console.log(res);
        this.interventionList = res;
        this.interventionList.forEach((e) => {
          e.category = plainToClass(Category, e.category);
        });
      }),
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.authService.redirectIfNotAuth();
        } else {
          Report.failure('Erreur', error.message, 'OK');
        }
      };
  }
}
