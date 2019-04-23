import { Component, OnInit } from '@angular/core';
import { CommonDataService } from '../core/services/common-data.service';

@Component({
  selector: 'app-sidebar-toggle',
  templateUrl: './sidebar-toggle.component.html',
  styleUrls: ['./sidebar-toggle.component.scss']
})
export class SidebarToggleComponent implements OnInit {

  constructor(public commonDataService: CommonDataService) { }

  ngOnInit() {
  }

}
