import { Component, OnInit } from '@angular/core';
import { DataService } from '../core/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-buiilder',
  templateUrl: './notification-buiilder.component.html',
  styleUrls: ['./notification-buiilder.component.scss']
})
export class NotificationBuiilderComponent implements OnInit {
  selectedEquipment = false;
  blockedPanel: false;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);
  }

}
