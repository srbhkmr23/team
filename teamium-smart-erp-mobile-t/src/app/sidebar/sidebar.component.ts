import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonDataService } from '../core/services/common-data.service';
import { Router } from '@angular/router';
import { HttpService } from '../core/services/http.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(public router: Router, public commonDataService: CommonDataService,public httpService: HttpService) { }
  ngOnInit() {
    this.commonDataService.hideSideBar();
  }

  redirectTo(path){
    this.router.navigate([path]);
    this.commonDataService.hideSideBar();
  }

  logOut(){   
    this.commonDataService.showSpinner();
    this.httpService.callApi('logout', {}).subscribe((response) => {
      this.commonDataService.hideSpinner();
      this.commonDataService.logout();
    }, (error) => {
      this.commonDataService.hideSpinner();
      this.commonDataService.logout();
      this.commonDataService.showSnackBar(error.error.message,"error")
    })
    
  }
}
