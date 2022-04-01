import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private router:Router) { }

  checkRegister(){
    return this.router.url=='/register'
  }

  checkLogin(){
    return this.router.url=='/login'
  }
  checkPropos(){
    return this.router.url=='/propos'
  }
  checkContct(){
    return this.router.url=='/contact'
  }
  ngOnInit(): void {
  }

}
