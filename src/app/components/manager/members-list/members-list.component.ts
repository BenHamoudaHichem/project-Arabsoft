import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Report } from 'notiflix';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { IUser } from 'src/app/services/user/iuser';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css'],
})
export class MembersListComponent implements OnInit {
  usersList!: IUser[];
  image!: string;
  pagination:Map<string,number>=new Map()


  constructor(
    private UserService: UserService,
    private AuthenticateService: AuthenticateService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    @Inject(SESSION_STORAGE) private storage: StorageService

  ) {}

  ngOnInit(): void {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);


    if (urlParams.has("role")) {

      switch (urlParams.get("status")) {
        case "tm":
        this.allTManagers()
        document.getElementById("tab1")?.click()
          break;
        default:
          this.allMembers()
          document.getElementById("tab2")?.click()
          break;
      }
  }
  else{
    this.allTManagers()
  }
}


  allTManagers() {
    this.image =
      'https://png.pngtree.com/background/20210711/original/pngtree-creative-synthetic-double-exposure-city-business-minimalist-background-picture-image_1115148.jpg';
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      if (urlParams.has("role")) {
        urlParams.set("role","tm")
      }
      else{
        urlParams.append("role","tm")
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
    this.UserService.all(query).subscribe((res) => {
      if (Number(res.headers.get("totalResults"))==0) {
        Report.info('Réclamations','Pas de résultat',"Je comprend")
      }
      this.pagination.set("totalResults",Number(res.headers.get("totalResults")))
      this.pagination.set("totalPages",Number(res.headers.get("totalPages")))
      this.pagination.set("page",Number(res.headers.get("page")!))
      this.pagination.set("size",Number(res.headers.get("size")))
      this.usersList = res.body!;
    }),
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.AuthenticateService.redirectIfNotAuth();
        } else {
          Report.failure('Error getting team manager', error.message, 'OK');
        }
      };
  }
  allMembers() {
    this.image = 'https://wallpaperaccess.com/full/4321838.jpg';



    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.has("role")) {
      urlParams.set("role","member")
    }
    else{
      urlParams.append("role","member")

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

    this.UserService.all(query).subscribe((res) => {
      if (Number(res.headers.get("totalResults"))==0) {
        Report.info('Réclamations','Pas de résultat',"Je comprend")
      }
      this.pagination.set("totalResults",Number(res.headers.get("totalResults")))
      this.pagination.set("totalPages",Number(res.headers.get("totalPages")))
      this.pagination.set("page",Number(res.headers.get("page")!))
      this.pagination.set("size",Number(res.headers.get("size")))
      this.usersList = res.body!;
    }),
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.AuthenticateService.redirectIfNotAuth();
        } else {
          Report.failure('Error getting members', error.message, 'OK');
        }
      };
  }
  convertRole(roles: any[]): string {
    if (roles[0].name == 'ROLE_TEAMMANAGER') {
      return "Chef d'équipe";
    }

    return 'Employé(e)';
  }
}
