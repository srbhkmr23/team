import { Component, OnInit } from '@angular/core';
import { CommonDataService } from '../core/services/common-data.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(public commonDataService: CommonDataService) { }

  ngOnInit() {
    this.commonDataService.setActivePage('notification');
  }

}
