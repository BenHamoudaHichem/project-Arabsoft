import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { Category } from 'src/app/models/Category';
import { Location } from 'src/app/models/Location';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { MapService } from 'src/app/services/map/map.service';
import { IIntervention } from 'src/app/services/works/intervention/iintervention';
import { InterventionService } from 'src/app/services/works/intervention/intervention.service';
const doneimg:string="assets/images/done.jpg"
const inprogressimg="https://images.unsplash.com/photo-1593436878396-e943a3cac98f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
@Component({
  selector: 'app-intervention-list',
  templateUrl: './intervention-list.component.html',
  styleUrls: ['./intervention-list.component.css'],
})
export class InterventionListComponent implements OnInit {
  interventionList!: IIntervention[];
  status!:string
  pagination:Map<string,number>=new Map()
  data:Location[]=[]
  constructor(private serviceIntervention: InterventionService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private AuthenticateService:AuthenticateService,
    private mapService:MapService) {
  }

  ngOnInit(): void {
    let qParams: Map<any,any>=new Map()
    qParams=plainToClass(Map,this.activatedRoute.snapshot.queryParams)
    if (!qParams.has("status")) {
      this.allByStatus("In_Progress")

    }
       this.location()


/*
    if (urlParams.has("status")) {
      this.allByStatus(urlParams.get("status")!)

    }
    else{
      this.allByStatus("In_Progress")

    }*/



  }

  //Interventions
  allByStatus(status:string )
  {

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        status: status
      },
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });
    this.interventionList=[]

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

    this.serviceIntervention.all(query).subscribe((res) => {

      if (Number(res.headers.get("totalResults"))==-0) {

        Report.info('Interventions','Pas de résultat',"Je comprend")
      }
      this.pagination.set("totalResults",Number(res.headers.get("totalResults")))
      this.pagination.set("totalPages",Number(res.headers.get("totalPages")))
      this.pagination.set("page",Number(res.headers.get("page")!))
      this.pagination.set("size",Number(res.headers.get("size")))

      this.interventionList = res.body!;
      this.interventionList.forEach(e=>{
        e.category=plainToClass(Category,e.category)
        e.address=plainToClass(Address,e.address)
      })



    }),
      (error: HttpErrorResponse) => {
        if(error.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        } else{
          Report.failure('Erreur', error.message,'OK')

        }         };
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

  this.serviceIntervention.all(query).subscribe((res) => {

    if (Number(res.headers.get("totalResults"))==-0) {

      Report.info('Interventions','Pas de résultat',"Je comprend")
    }

    res.body!.forEach(e=>{
      e.address=plainToClass(Address,e.address)
      this.data.push(e.address.Location())
    })
  this.mapService.initilizeMap(this.data)

}),
(error: HttpErrorResponse) => {
  if(error.status==401){
    this.AuthenticateService.redirectIfNotAuth()

  } else{
    Report.failure('Erreur', error.message,'OK')

  }
};
}

public get img() : string {
  return inprogressimg
}

public get hasResult() : boolean {
  return this.interventionList !== undefined&& this.interventionList.length!==0
}


}
