import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
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
  @ViewChild('target') mapElement:any
  @Output() responseIsComming = new EventEmitter();

  materialList!: IMaterial[];
  status!: string;
  data: Location[]=[]
  constructor(
    private serviceMaterial: EquipmentService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private AuthenticateService:AuthenticateService,
    private mapService:MapService,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {

  }

  ngOnInit(): void {
    this.showAll()
    this.location()
  }

  showAll() {
   /* this.router.navigate(['.'], {
      relativeTo: this.activatedRoute,
      queryParams: {},
    });*/

    let queryParams
    if (window.location.href.includes("?")) {
      queryParams=window.location.href.substring(window.location.href.indexOf("?")+1)

    }
    this.serviceMaterial.all(queryParams).subscribe((res:HttpResponse<IMaterial[]>) => {
      this.storage.set("totalResults",res.headers.get("totalResults"))
      this.storage.set("totalPages",res.headers.get("totalPages"))
      this.storage.set("page",Number(res.headers.get("page")!))
      this.storage.set("size",res.headers.get("size"))

      this.materialList = res.body!
    }),
    (error: HttpErrorResponse) => {
      if(error.status==401){
        this.AuthenticateService.redirectIfNotAuth()

      } else{
        Report.failure('Erreur', error.message,'OK')

      }         };
  }
  allByStatus(status:string) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        status: status
      },
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });
    this.serviceMaterial
      .allByStatus(status)
      .subscribe((res) => {
        this.materialList = res;
      }),
      (error: HttpErrorResponse) => {
        if(error.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        } else{
          Report.failure('Erreur', error.message,'OK')

        }        };
  }


  location(){
    let queryParams:string|undefined
    if (window.location.href.includes("?")) {
      queryParams=window.location.href.substring(window.location.href.indexOf("?")+1)
    }

      this.serviceMaterial.all(queryParams).subscribe((res) => {

      res.body!.forEach(e=>{
          e.address=plainToClass(Address,e.address)
        })
      for(let i=0;i<res.body!.length;i++){
         this.data.push(res.body![i].address.Location())
      }
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
