import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private route: Router) {
    this.checkRoutr();
  }
  w = false;
  title = 'appGestInerventions';
  checkRoutr() {
    return (
      this.route.url.includes('/manager') ||
      this.route.url.includes('/customer')
    );
  }
  Exist() {
    return this.route.url == '/home';
  }
  checkHome() {
    return this.route.url == '/home';
  }
}
