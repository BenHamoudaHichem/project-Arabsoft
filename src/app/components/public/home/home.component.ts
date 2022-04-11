import { Component, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponentPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
   

  }

  toLoginPage(){
    this.router.navigate(['/login'])
  }

}
