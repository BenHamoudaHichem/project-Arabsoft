import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { Category } from 'src/app/models/Category';
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
  constructor(private serviceIntervention: InterventionService,private route:ActivatedRoute) {
  }

  ngOnInit(): void {
    this.showPerStatus('In_Progress')
  }

  //Interventions
  showPerStatus(status:string)
  {
    this.serviceIntervention.interventionPerStatus(status).subscribe((res: IIntervention[]) => {
      console.log(res)
      this.interventionList = res;
      this.interventionList.forEach(e=>{
        e.category=plainToClass(Category,e.category)
      })
    }),
      (error: HttpErrorResponse) => {
        alert(error.message);
      };
  }

}
