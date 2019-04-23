import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class LanguageTranslateService {
  browserLanguage: string;
  constructor(private translate:TranslateService) {
    this.browserLanguage = translate.getBrowserLang();

    if (!sessionStorage.getItem('selectedLanguage')) {
      if (confirm("Your browser language is: " + this.browserLanguage + " ,Do you want to set your app language to " + this.browserLanguage + "?")) {
        translate.setDefaultLang(this.browserLanguage);
        translate.use(this.browserLanguage);
        sessionStorage.setItem('selectedLanguage', this.browserLanguage);

      } else {
        translate.setDefaultLang('en');
        translate.use('en');
        sessionStorage.setItem('selectedLanguage', 'en');
      }
} else {
      translate.setDefaultLang(sessionStorage.getItem('selectedLanguage'));
    }

   }
}
