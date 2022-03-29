import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Report } from 'notiflix';
import { CookiesService } from 'src/app/services/cookies.service';
import { IUser } from 'src/app/services/user/iuser';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-customer-profil',
  templateUrl: './customer-profil.component.html',
  styleUrls: ['./customer-profil.component.css']
})
export class CustomerProfilComponent implements OnInit {
id!:string
user!:IUser
  constructor( private cookiesServices:CookiesService,private userService:UserService) { }

  ngOnInit(): void {
    this.getUser()
  }
getUser()
{
 this.id=this.cookiesServices.getIdentifier
 this.userService.getUser(this.id).subscribe((data:IUser)=>
{
this.user=data
console.log(this.user)
}),
(error:HttpErrorResponse)=>{
  Report.failure("Error getting user",error.message,"OK")
}}

}
