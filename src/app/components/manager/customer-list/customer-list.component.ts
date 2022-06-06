import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
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
  constructor(
    private UserService: UserService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private AuthenticateService: AuthenticateService
  ) {}

  ngOnInit(): void {
    this.allByRole();
  }

  allByRole() {
    this.UserService.all('role=ROLE_CUSTOMER').subscribe((res) => {
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
