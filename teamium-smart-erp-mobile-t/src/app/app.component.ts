import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonDataService } from './core/services/common-data.service';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  public isSpinnerActive:any=false;
  constructor(translate: TranslateService, public commonDataService: CommonDataService,private cdRef:ChangeDetectorRef){
    translate.setDefaultLang('en');
    translate.use('en');
  }
  ngOnInit () {
    this.commonDataService.activeSpinnerChange.subscribe((value) => {
      this.isSpinnerActive = value;
      this.cdRef.detectChanges();
  });
}
}
