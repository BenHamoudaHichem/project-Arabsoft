import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Report } from 'notiflix';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { IUser } from 'src/app/services/user/iuser';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
})
export class CustomerListComponent implements OnInit {
  usersList!: IUser[];
  @Output() responseIsComming = new EventEmitter();
  pagination:Map<string,number>=new Map()
  constructor(
    private UserService: UserService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private AuthenticateService: AuthenticateService
  ) {}

  ngOnInit(): void {
    this.allByRole();
  }

  allByRole() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (!urlParams.has("role")) {
      urlParams.append("role","customer")
    }
    let query:string=""

    urlParams.forEach((v,k)=>{

      query=query.concat(k+"="+v+"&")
    })
    query=query.slice(0,-1)
    this.UserService.all(query).subscribe((res) => {
      if (Number(res.headers.get("totalResults"))==0) {

        Report.info('Clients','Pas de résultat',"Je comprend")
      }
      this.pagination.set("totalResults",Number(res.headers.get("totalResults")))
      this.pagination.set("totalPages",Number(res.headers.get("totalPages")))
      this.pagination.set("page",Number(res.headers.get("page")!))
      this.pagination.set("size",Number(res.headers.get("size")))
      this.usersList = res.body! as IUser[]
      console.log();


    }),
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.AuthenticateService.redirectIfNotAuth();
        } else {
          Report.failure('Erreur', error.message, 'OK');
        }
      };
  }
}
