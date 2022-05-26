import { Component, OnInit } from '@angular/core';
import { interventionClosedService } from 'src/app/services/works/intervention/intervention-closed.service';
import { IInterventionClosed }  from 'src/app/services/works/intervention/iinterventionClosed';
import { ActivatedRoute } from '@angular/router';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Report } from 'notiflix';

@Component({
  selector: 'app-intervention-closed-list',
  templateUrl: './intervention-closed-list.component.html',
  styleUrls: ['./intervention-closed-list.component.css']
})
export class InterventionClosedListComponent implements OnInit {

  interventionList!: IInterventionClosed[];
  status!:string
  data:Location[]=[]
  constructor(private interventionClosedService: interventionClosedService,
    private route:ActivatedRoute,
    private AuthenticateService:AuthenticateService) {
  }
  ngOnInit(): void {
    this.all()  }
  all()
  {
    this.interventionList=[]
    this.interventionClosedService.all().subscribe((res: IInterventionClosed[]) => {
      console.log(res)
      this.interventionList = res;

    }),
      (error: HttpErrorResponse) => {
        if(error.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        } else{
          Report.failure('Erreur', error.message,'OK')

        }         };
  }
}
