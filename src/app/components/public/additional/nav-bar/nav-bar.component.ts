import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private router:Router,public  translate:TranslateService,@Inject(SESSION_STORAGE) private storage: StorageService) {
    this.translate.use(this.storage.get("Lang"));

  }

 //Switch language
 translateLanguageTo(lang: string) {

  this.storage.set("Lang",lang)

  this.translate.use(this.storage.get("Lang"));

}
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
