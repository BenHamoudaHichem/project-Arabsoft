import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { Category } from 'src/app/models/Category';
import { Location } from 'src/app/models/Location';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { MapService } from 'src/app/services/map/map.service';
import { IIntervention } from 'src/app/services/works/intervention/iintervention';
import { InterventionService } from 'src/app/services/works/intervention/intervention.service';

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
    private route:ActivatedRoute,
    private AuthenticateService:AuthenticateService,
    private mapService:MapService) {
  }

  ngOnInit(): void {
    this.showPerStatus('In_Progress')
    this.location()
  }

  //Interventions
  showPerStatus(status:string)
  {
    this.interventionList=[]
    this.serviceIntervention.interventionPerStatus(status).subscribe((res: IIntervention[]) => {
      console.log(res)
      this.interventionList = res;
      this.interventionList.forEach(e=>{
        e.category=plainToClass(Category,e.category)
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

  this.serviceIntervention.all().subscribe((res: IIntervention[]) => {

    res.forEach(e=>{
      e.address=plainToClass(Address,e.address)
    })
  for(let i=0;i<res.length;i++){
this.data.push(res[i].address.Location())
  }
 console.log(this.data)
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

}
