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
  pagination:Map<string,number>=new Map()
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
      this.pagination.set("totalResults",Number(res.headers.get("totalResults")))
      this.pagination.set("totalPages",Number(res.headers.get("totalPages")))
      this.pagination.set("page",Number(res.headers.get("page")!))
      this.pagination.set("size",Number(res.headers.get("size")))

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

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.has("status")) {
      urlParams.set("status",status)
    }
    else{
      urlParams.append("status",status)
    }
    let query:string=""
    urlParams.forEach((v,k)=>{

      query=query.concat(k+"="+v+"&")
    })
    query=query.slice(0,-1)
    this.serviceMaterial.all(status).subscribe((res) => {

      if (Number(res.headers.get("totalResults"))==-0) {

        Report.info('Interventions','Pas de résultat',"Je comprend")
      }
        this.materialList = res.body!;
      }),
      (error: HttpErrorResponse) => {
        if(error.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        } else{
          Report.failure('Erreur', error.message,'OK')

        }        };
  }


  location(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.has("status")) {
      urlParams.set("status",status)
    }
    else{
      urlParams.append("status",status)
    }
    let query:string=""
    urlParams.forEach((v,k)=>{

      query=query.concat(k+"="+v+"&")
    })
    query=query.slice(0,-1)

      this.serviceMaterial.all(query).subscribe((res) => {

        if (Number(res.headers.get("totalResults"))==-0) {

          Report.info('Interventions','Pas de résultat',"Je comprend")
        }
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

  public get hasResult() : boolean {
    return this.materialList !== undefined&& this.materialList.length!==0
  }


}
