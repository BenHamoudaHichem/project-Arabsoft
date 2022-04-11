import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Report } from 'notiflix';
import{Category} from 'src/app/models/Category';
import { CategoryService } from 'src/app/services/category/category.service';
import { ICategory } from 'src/app/services/category/icategory';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categorieForm!:FormGroup
  listCategorie!:ICategory[]
  constructor(private formBuilder: FormBuilder,private router:Router,private categorieService:CategoryService) {
    this.categorieForm = this.formBuilder.group({
      categorie: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]')]],
    });
  }
get categorie(){return this.categorieForm.get('categorie')}
  ngOnInit(): void {
    this.getAll()
  }


  addCategorie(){let categorie=new Category(String(this.categorie?.value))
this.categorieService.create(categorie).subscribe((res: any) => {
  if(res.status==true)
  {
    Report.success("Notification d'ajout", res.message, "D'accord");
  }
  else{
    Report.warning("Notification d'ajout", res.message, "D'accord");
  }
  this.router.navigateByUrl('/dashboard/manager/categorylist');
}),
  (error: HttpErrorResponse) => {
    Report.warning("Notification d'ajout", error.message, "D'accord");
  };
}

getAll(){this.categorieService.all().subscribe((res:ICategory[])=>{
this.listCategorie=res
},
(error: HttpErrorResponse) => {
 Report.failure('Erreur', error.message,'OK')
})}
  }


