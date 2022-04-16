import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(public translate: TranslateService) {
    console.log(translate.currentLoader);

    // Register translation languages
    translate.addLangs(['en', 'fr']);
    // Set default language
  //  translate.setDefaultLang('en');
    let browserLang = translate.getBrowserLang();
    translate.use(browserLang ? browserLang : 'en');
    console.log(this.getCurrentLang());
  }

  getCurrentLang() {
    console.log('browser lang', this.translate.getBrowserLang());
    console.log('browser lang', this.translate.currentLang);
  }
}
