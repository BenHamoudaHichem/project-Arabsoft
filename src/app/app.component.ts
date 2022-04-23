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
    storage.set("Lang",storage.get("Lang") || String(window.navigator.language).substring(0,2))
    translate.use(storage.get("Lang"));


    console.log(window.navigator.language)
  }
}
