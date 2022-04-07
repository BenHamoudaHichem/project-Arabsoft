import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Report } from 'notiflix';
import { IUser } from 'src/app/services/user/iuser';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-details-customer',
  templateUrl: './details-customer.component.html',
  styleUrls: ['./details-customer.component.css']
})
export class DetailsCustomerComponent implements OnInit {
user!:IUser
  constructor(private route:ActivatedRoute,private userService:UserService) {
    this.route.snapshot.paramMap.get('id');
    console.log(String(this.route.snapshot.paramMap.get('id')));

this.showUser() }

  ngOnInit(): void {

  }

showUser(){
  this.userService.getUser(String(this.route.snapshot.paramMap.get('id')))
  .subscribe((data: IUser) => {
    this.user = data;
    console.log(this.user);
  }),
  (error: HttpErrorResponse) => {
    Report.failure('Error getting user', error.message, 'OK');
  };
}
}


