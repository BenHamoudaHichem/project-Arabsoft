import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
    private AuthenticateService: AuthenticateService
  ) {}

  ngOnInit(): void {
    this.allByRole();
  }

  allByRole() {
    this.UserService.allByRole('ROLE_USER').subscribe((res: IUser[]) => {
      console.log(res);
      this.usersList = res;
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
