import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { Report } from 'notiflix';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit,OnChanges {
  @Input() paginationParams!:Map<string,number>


  totalp!:Map<string,number>
  constructor(private router:Router,private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this.allPages);

    if (this.allPages==-1) {
      Report.warning('<i class="fa-solid fa-face-frown"></i>',"Pas de résultat","D'accord")
      return;
    }

  }
  ngOnChanges(changes: SimpleChanges){


   // console.log(changes["paginationParams"].currentValue)
//          Report.warning('<i class="fa-solid fa-face-frown"></i>',"Pas de résultat","D'accord")
}

  next(){



    if (this.allPages!<this.getCurrentPage!+1) {
      Report.warning('<i class="fa-fa-face-frown"></i>',"Pas de résultat","D'accord")
      return;
    }
    let mapResult:Map<string,any>=new Map()
    mapResult.set("page",this.getCurrentPage!+1)
    mapResult.set("size",Number(this.paginationParams.get("size")))
    const params = new URLSearchParams(window.location.search)
    params.forEach((v,k)=>{
      if (k=="page") {
        return;
      }
        if (k=="size") {
        return;
      }
      mapResult.set(k,v)


    })

    let url:string=this.router.url
    if (this.router.url.includes("?")) {
      url=url.substring(0,url.indexOf("?"))
    }
    this.router.navigate(
      [url],
      {
        relativeTo: this.activatedRoute,
        queryParams: Object.fromEntries(mapResult),
        fragment:"merge"
      });
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
  }
  previous(){
    if (0>this.getCurrentPage!-1) {
      Report.warning('<i class="fa-solid fa-face-frown"></i>',"Pas de résultat","D'accord")
      return;
    }
    let mapResult:Map<string,any>=new Map()
    mapResult.set("page",this.getCurrentPage!-1)
    mapResult.set("size",Number(this.paginationParams.get("size")))
    const params = new URLSearchParams(window.location.search)
    params.forEach((v,k)=>{
      if (k=="page") {
        return;
      }
        if (k=="size") {
        return;
      }
      mapResult.set(k,v)
    })

    let url:string=this.router.url
    if (this.router.url.includes("?")) {
      url=url.substring(0,url.indexOf("?"))
    }
    this.router.navigate(
      [url],
      {
        relativeTo: this.activatedRoute,
        queryParams: Object.fromEntries(mapResult),
        fragment:"merge",
        //skipLocationChange:true
      });
      console.log(mapResult);

      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      console.log("hey");

  }

  public get getCurrentPage() : number  {
    return this.paginationParams.get("page")||0
  }

  public get allPages() : number  {
    return this.paginationParams.get("totalPages")!
  }


  public get hasResult() : boolean {
    return this.allPages!==undefined&& this.allPages!==-1
  }
  public get load() : boolean {

    return this.allPages==-1
  }





}
