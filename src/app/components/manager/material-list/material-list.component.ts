import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { Location } from 'src/app/models/Location';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { MapService } from 'src/app/services/map/map.service';
import { IMaterial } from 'src/app/services/resources/material/imaterial';
import { EquipmentService } from 'src/app/services/resources/material/material.service';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.css'],
})
export class MaterialListComponent implements OnInit {
  materialList!: IMaterial[];
  status!: string;
  data: Location[]=[]
  constructor(
    private serviceMaterial: EquipmentService,
    private route: ActivatedRoute,
    private AuthenticateService:AuthenticateService,
    private mapService:MapService
  ) {
    this.showAll();
    this.location()

  }

  ngOnInit(): void {}

  showAll() {
    this.serviceMaterial.all().subscribe((IM: IMaterial[]) => {
      this.materialList = IM;

    }),
    (error: HttpErrorResponse) => {
      if(error.status==401){
        this.AuthenticateService.redirectIfNotAuth()

      } else{
        Report.failure('Erreur', error.message,'OK')

      }         };
  }
  allByStatus(status:string) {

    this.serviceMaterial
      .allByStatus(status)
      .subscribe((res: IMaterial[]) => {
        this.materialList = res;
        console.log(res.length)
      }),
      (error: HttpErrorResponse) => {
        if(error.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        } else{
          Report.failure('Erreur', error.message,'OK')

        }        };
  }


  location(){

      this.serviceMaterial.all().subscribe((IM: IMaterial[]) => {

      IM.forEach(e=>{
          e.address=plainToClass(Address,e.address)
        })
      for(let i=0;i<IM.length;i++){
this.data.push(IM[i].address.Location())
      }
    //  console.log(this.data)
      this.mapService.initilizeMap(this.data)

    }),
    (error: HttpErrorResponse) => {
      if(error.status==401){
        this.AuthenticateService.redirectIfNotAuth()

      } else{
        Report.failure('Erreur', error.message,'OK')

      }         };
  }

  get Status():string{
let status="Fonctionnel"
this.materialList.forEach(element => {
  switch (element.status) {
    case 'Stoled':
      status="Volé"
      break;
    case 'Expired':
      status="Expiré"
       break;
    case 'Broken_down':
      status="En panne"
      break;
  }
});
return status

  }


  loadMap(){
    this.ngOnInit()
  }

}
