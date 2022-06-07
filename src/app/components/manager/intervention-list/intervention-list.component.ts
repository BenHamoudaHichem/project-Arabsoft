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
  data:Location[]=[]
  constructor(private serviceIntervention: InterventionService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private AuthenticateService:AuthenticateService,
    private mapService:MapService) {
  }

  ngOnInit(): void {
    this.allByStatus('In_Progress')
    this.location()
  }

  //Interventions
  allByStatus(status:string)
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
    this.serviceIntervention.allByStatus(status).subscribe((res) => {
      this.storage.set("totalResults",res.headers.get("totalResults"))
      this.storage.set("totalPages",res.headers.get("totalPages"))
      this.storage.set("page",Number(res.headers.get("page")!))
      this.storage.set("size",res.headers.get("size"))
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
  let queryParams:string|undefined
  if (window.location.href.includes("?")) {
    queryParams=window.location.href.substring(window.location.href.indexOf("?")+1)
  }

  this.serviceIntervention.all(queryParams).subscribe((res) => {

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


}
