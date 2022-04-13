import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { Address } from 'src/app/models/Address';
import { User } from 'src/app/models/user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { HomeLoaderService } from 'src/app/services/home/home-loader.service';
import { IHomeManager } from 'src/app/services/home/ihome-manager';
import { ITeam } from 'src/app/services/resources/team/iteam';
import { TeamService } from 'src/app/services/resources/team/team.service';

@Component({
  selector: 'app-home-manager',
  templateUrl: './home-manager.component.html',
  styleUrls: ['./home-manager.component.css']
})
export class HomeManagerComponent implements OnInit {

  infos!:IHomeManager
  teamList!:ITeam[]
  constructor(private homeLoaderService:HomeLoaderService,private teamService:TeamService ,private authService:AuthenticateService) {
    this.homeLoaderService.loadHomeForManager().subscribe((res:IHomeManager)=>{
      this.infos=res
      console.log(this.infos)
    })
    console.log(this.authService.isLogin)
  }

  ngOnInit(): void {

  }
  TeamsArray()
  {
    this.teamService.all().subscribe((IT: ITeam[]) => {
      this.teamList = IT
      this.teamList.forEach(item => {
        item.manager=plainToClass(User,item.manager)

        item.manager.setAddress(plainToClass(Address,item.manager.getAddress()))
        item.members.forEach(subItem => {
          subItem=plainToClass(User,subItem)
          subItem.setAddress(plainToClass(Address,subItem.getAddress()))

        });
      });

      console.log(this.teamList)

    }),
      (error: HttpErrorResponse) => {
        alert(error.message);
      };
  }
  displayStatus(status:string):string
  {
    if(status=="Available")
    {
      return "Disponible"
    }
    return "Indisponible"
  }

}
