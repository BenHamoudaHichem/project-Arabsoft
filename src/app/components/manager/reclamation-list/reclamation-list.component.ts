import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

import { Report } from 'notiflix';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { DemandService } from 'src/app/services/works/demand/demand.service';
import { IDemand } from 'src/app/services/works/demand/idemand';
const claimImg:string="assets/images/claim.png"
@Component({
  selector: 'app-reclamation-list',
  templateUrl: './reclamation-list.component.html',
  styleUrls: ['./reclamation-list.component.css'],
})
export class ReclamationListComponent implements OnInit {
  status!: string;
  pagination:Map<string,number>=new Map()
  demandList!: IDemand[];
  constructor(
    private serviceDemand: DemandService,
    private router: Router,
    private activatedRoute:ActivatedRoute,
    private AuthenticateService: AuthenticateService,
    @Inject(SESSION_STORAGE) private storage: StorageService

  ) {
    this.all();
  }

  ngOnInit(): void {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);


    if (urlParams.has("status")) {

      switch (urlParams.get("status")) {
        case "In_Progress":

        document.getElementById("tab2")?.click()
          break;
        default:
          document.getElementById("tab3")?.click()
          break;
      }
    }


  }

  all(status:string|undefined=undefined) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (!urlParams.has("status")&&status===undefined) {

      urlParams.delete("status")
      console.log(urlParams);

    }else{
      if (!urlParams.has("status")) {
        urlParams.append("status",status!)
      }
      else{
        urlParams.set("status",status!)

      }
    }
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: Object.assign({},urlParams),
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });
    let query:string=""
    urlParams.forEach((v,k)=>{


      query=query.concat(k+"="+v+"&")
    })
    query=query.slice(0,-1)


    this.serviceDemand.all(query).subscribe((res) => {
      if (Number(res.headers.get("totalResults"))==0) {
        Report.info('Réclamations','Pas de résultat',"Je comprend")
      }
      this.pagination.set("totalResults",Number(res.headers.get("totalResults")))
      this.pagination.set("totalPages",Number(res.headers.get("totalPages")))
      this.pagination.set("page",Number(res.headers.get("page")!))
      this.pagination.set("size",Number(res.headers.get("size")))
      this.demandList = res.body!;

    }),
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.AuthenticateService.redirectIfNotAuth();
        } else {
          Report.failure('Erreur', error.message, 'OK');
        }
      };
  }

  public get img() : string {
    return claimImg
  }
  public get hasResult() : boolean {
    return this.demandList !== undefined&& this.demandList.length!==0
  }

}
