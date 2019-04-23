import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TranslateService } from '@ngx-translate/core';
import { browser } from 'protractor';
import { LanguageTranslateService } from './core/services/language-translate.service';
import { DataService } from './data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
 public liClicked:boolean;
 public blockedPanel:boolean=false;
  constructor(private dataService :DataService,private router: Router){
      this.liClicked = this.dataService.isWrapperActive;
  }

  ngOnInit () {
    this.router.events.subscribe(event => {
        if (event instanceof RouteConfigLoadStart) {
            this.blockedPanel = true;
        } else if (event instanceof RouteConfigLoadEnd) {
            this.blockedPanel = false;
        }
    });
}


 
  title = 'app';}
