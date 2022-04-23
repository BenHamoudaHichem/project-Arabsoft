import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(public translate: TranslateService,@Inject(SESSION_STORAGE) private storage: StorageService) {
    // Register translation languages
    translate.addLangs(['en', 'fr']);

    // Set default language
    if(window.navigator.language.length>2){
   let windowLang= window.navigator.language.substr(0,2).toLowerCase();
   storage.set("Lang",storage.get("Lang") || windowLang)
  }
  else{
    storage.set("Lang",storage.get("Lang") || window.navigator.language.toLowerCase())}
    translate.use(storage.get("Lang"));


    console.log(window.navigator.language)
  }
}
