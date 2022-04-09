import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Report } from 'notiflix';
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
    private route: ActivatedRoute,private router:Router
  ) {}

  ngOnInit(): void {
    this.route.snapshot.paramMap.get('id');
    console.log(String(this.route.snapshot.paramMap.get('id')));
    if (this.route.snapshot.paramMap.has('id')) {
      this.userService
        .getUser(String(this.route.snapshot.paramMap.get('id')))
        .subscribe((data: IUser) => {
          this.user = data;
          console.log(this.user);
        }),
        (error: HttpErrorResponse) => {
          Report.failure('Error getting user', error.message, 'OK');
        };
    } else {
      this.userService
        .getUser(this.cookiesServices.getIdentifier)
        .subscribe((data: IUser) => {
          this.user = (data);
          console.log(this.user);
        }),
        (error: HttpErrorResponse) => {
          Report.failure('Error getting user', error.message, 'OK');
        };
    }
  }
  isProfilUser() {
 return this.cookiesServices.getIdentifier ==this.route.snapshot.paramMap.get('id') || (this.cookiesServices.getIdentifier!=null && this.router.url.includes('customer'))
  }

}
