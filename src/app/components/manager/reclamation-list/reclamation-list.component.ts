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
    console.log(window.location.href.substring(window.location.href.indexOf("?")));


  }

  all() {


    let queryParams:string|undefined

    if (window.location.href.includes("?")) {
      queryParams=window.location.href.substring(window.location.href.indexOf("?")+1)

    }

    this.serviceDemand.all(queryParams).subscribe((res) => {
      this.storage.set("totalResults",res.headers.get("totalResults"))
      this.storage.set("totalPages",res.headers.get("totalPages"))
      this.storage.set("page",Number(res.headers.get("page")!))
      this.storage.set("size",res.headers.get("size"))
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
  allByStatus(status:string) {
    this.router.navigate(['.'], {
      relativeTo: this.activatedRoute,
      queryParams: {},
      skipLocationChange: true

    });
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        status: status
      },
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });

    this.serviceDemand.allByStatus(status,undefined).subscribe((res) => {
      this.storage.set("totalResults",res.headers.get("totalResults"))
      this.storage.set("totalPages",res.headers.get("totalPages"))
      this.storage.set("page",Number(res.headers.get("page")!))
      this.storage.set("size",res.headers.get("size"))
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
}
