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
    this.router.events
    .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
    .subscribe((events: RoutesRecognized[]) => {
      console.log('previous url', events[0].urlAfterRedirects);
      console.log('current url', events[1].urlAfterRedirects);
    });
    
  }

  toLoginPage(){
    this.router.navigate(['/login'])
  }

}
