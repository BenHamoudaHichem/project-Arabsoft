import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { Report } from 'notiflix';
import { Material } from 'src/app/models/resources/Material';
import { User } from 'src/app/models/user';
import { CategoryService } from 'src/app/services/category/category.service';
import { IIntervention } from 'src/app/services/works/intervention/iintervention';

@Component({
  selector: 'app-detail-category',
  templateUrl: './detail-category.component.html',
  styleUrls: ['./detail-category.component.css']
})
export class DetailCategoryComponent implements OnInit {
interventionList!:IIntervention[]
  constructor(private serviceCategory:CategoryService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.serviceCategory.findInterventionsByCategory(String(this.route.snapshot.paramMap.get('id'))).subscribe((res:IIntervention[])=>{
this.interventionList=res
console.log(this.interventionList)

this.interventionList.forEach(element => {

  element.team.manager=plainToClass(User,element.team.manager);
  element.team.members.forEach(m => {
    m=plainToClass(User,m)
  });
  

});
    }),
    (error:HttpErrorResponse)=>{
      Report.failure('Error getting interventions',error.message,'OK')
    }
  }

}
