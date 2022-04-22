import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Report } from 'notiflix';
import{Category} from 'src/app/models/Category';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { ICategory } from 'src/app/services/category/icategory';
import { HTMLEscape } from 'src/app/services/validation/HTMLEscapeChars';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categorieForm!:FormGroup
  listCategorie!:ICategory[]
  constructor(private formBuilder: FormBuilder,private router:Router,
    private AuthenticateService:AuthenticateService,private categorieService:CategoryService) {
    this.categorieForm = this.formBuilder.group({
      categorie: ['', [Validators.required]],
    });
  }
get categorie(){return this.categorieForm.get('categorie')}
  ngOnInit(): void {
    this.getAll()
  }


  addCategorie(){let categorie=new Category( HTMLEscape.escapeMethod(String(this.categorie?.value)))
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
    if(error.status==401){
      this.AuthenticateService.redirectIfNotAuth()

    }else{
      Report.failure('Erreur', error.message,'OK')

    }      };
}

getAll(){this.categorieService.all().subscribe((res:ICategory[])=>{
this.listCategorie=res
},
(error: HttpErrorResponse) => {
 if(error.status==401){
  this.AuthenticateService.redirectIfNotAuth()

}else{
  Report.failure('Erreur', error.message,'OK')

}
})}

check()
{
 Object.keys(this.categorieForm.controls).forEach(key => {
   if (this.categorieForm.get(key)!.errors) {
   console.log(this.categorieForm.get(key)!.errors)
    if(this.categorieForm.get(key)!.errors!.hasOwnProperty('required'))
    {
      Report.failure(key,"Champs obligatoire","D'accord")
    }
    if(this.categorieForm.get(key)!.errors!.hasOwnProperty('pattern'))
    {
      let stringAlpha:string=" des lettres alphabétiques "
      let stringdigit:string=" des chiffres "
      let stringMin:string=" au minimum "
      let stringMax:string=" au maximum "
      let stringOperation:string=String(this.categorieForm.get(key)!.errors!["pattern"].requiredPattern)
      console.log(stringOperation);

      let res:string=""
      if(stringOperation.indexOf("a-z")!=-1)
      {
        res="Ce champs doit contenir"
        res=res+stringAlpha
      }
      if(stringOperation.indexOf("0-9")!=-1){
        if(res.length==0){res="Ce champs doit contenir"
      res=res+ stringdigit}else{

        res=res+"et"+stringdigit
      }
    }

      if (stringOperation.includes("{")) {
        let min:number=Number(stringOperation.substring(
          stringOperation.indexOf("{")+1,
          stringOperation.indexOf(",")
        ))
        res=res.concat("avec un taille de "+min+stringMin)
        if ((Number(stringOperation.substring(stringOperation.indexOf(",")+1,stringOperation.indexOf("}")))!==0)) {
          let max:number=Number(stringOperation.substring(
            stringOperation.indexOf(",")+1,
            stringOperation.indexOf("}")
          ))
          res=res.concat("et de "+max+stringMax)
        }
      }

      Report.failure(key,res,"D'accord")
    }

   }
})
}
  }


