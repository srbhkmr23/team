import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonDataService } from '../core/services/common-data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public router: Router, public commonDataService: CommonDataService) { }
  ngOnInit() {
  }
  redirectTo(path){
    this.router.navigate([path]);
    this.commonDataService.hideSideBar();
  }
}
