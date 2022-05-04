import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { CookiesService } from 'src/app/services/cookies.service';
import { IUser } from 'src/app/services/user/iuser';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-customer-profil',
  templateUrl: './customer-profil.component.html',
  styleUrls: ['./customer-profil.component.css'],
})
export class CustomerProfilComponent implements OnInit {
  user!: IUser;

  constructor(
    private cookiesServices: CookiesService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private AuthenticateService: AuthenticateService
  ) {}

  ngOnInit(): void {
    this.route.snapshot.paramMap.get('id');
    console.log(String(this.route.snapshot.paramMap.get('id')));
    if (this.route.snapshot.paramMap.has('id')) {
      this.userService
        .findUser(String(this.route.snapshot.paramMap.get('id')))
        .subscribe((data: IUser) => {
          this.user = data;
          this.user.address=plainToClass(Address,data.address)
          console.log(this.user);
        }),
        (error: HttpErrorResponse) => {
          if (error.status == 401) {
            this.AuthenticateService.redirectIfNotAuth();
          } else {
            Report.failure('Erreur', error.message, 'OK');
          }
        };
    } else {
      this.userService
        .findUser(this.cookiesServices.getIdentifier)
        .subscribe((data: IUser) => {
          this.user = data;
          this.user.address=plainToClass(Address,data.address)

          console.log(this.user);
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
get Role():string
{
 let res="Membre"
 switch (this.user.roles[0].name) {
     case 'ROLE_CUSTOMER':
     res="Client"
     break;
     case 'ROLE_TEAMMANAGER':
     res="Chef d'équipe"
     break;
    case 'ROLE_MANAGER':
     res="Gestionnaire"
     break;
 }
  return res
}

  isProfilUser() {
    return (
      this.cookiesServices.getIdentifier ==
        this.route.snapshot.paramMap.get('id') ||
      (this.cookiesServices.getIdentifier != null &&
        this.router.url.includes('customer'))
    );
  }
}
