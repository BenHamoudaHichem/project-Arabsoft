import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private UserService: UserService,
    private AuthenticateService: AuthenticateService,
    private activatedRoute:ActivatedRoute,
    @Inject(SESSION_STORAGE) private storage: StorageService

  ) {}

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.queryParamMap.has('searchKey')) {
      const firstParam: string = this.activatedRoute.snapshot.queryParamMap.get('searchKey')!;


    }


    this.image = 'https://wallpaperaccess.com/full/4321838.jpg';

    this.allTManagers();
  }

  agents() {
    let queryParams:string|undefined
    if (window.location.href.includes("?")) {
      queryParams=window.location.href.substring(window.location.href.indexOf("?")+1)
    }
    this.UserService.agents(queryParams).subscribe((res) => {
      this.storage.set("totalResults",res.headers.get("totalResults"))
      this.storage.set("totalPages",res.headers.get("totalPages"))
      this.storage.set("page",Number(res.headers.get("page")!))
      this.storage.set("size",res.headers.get("size"))
      this.usersList = res.body!;
    }),
      (error: HttpErrorResponse) => {
        Report.failure('Erreur', error.message, 'OK');
      };
  }
  allTManagers() {
    this.image =
      'https://png.pngtree.com/background/20210711/original/pngtree-creative-synthetic-double-exposure-city-business-minimalist-background-picture-image_1115148.jpg';

    this.UserService.allByRole('tm',undefined).subscribe((res) => {
      this.storage.set("totalResults",res.headers.get("totalResults"))
      this.storage.set("totalPages",res.headers.get("totalPages"))
      this.storage.set("page",Number(res.headers.get("page")!))
      this.storage.set("size",res.headers.get("size"))
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

    this.UserService.allByRole('member',undefined).subscribe((res) => {
      this.storage.set("totalResults",res.headers.get("totalResults"))
      this.storage.set("totalPages",res.headers.get("totalPages"))
      this.storage.set("page",Number(res.headers.get("page")!))
      this.storage.set("size",res.headers.get("size"))
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
