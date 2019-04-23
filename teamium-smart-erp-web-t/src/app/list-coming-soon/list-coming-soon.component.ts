import { Component, OnInit } from '@angular/core';
import { DataService } from '../core/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-coming-soon',
  templateUrl: './list-coming-soon.component.html',
  styleUrls: ['./list-coming-soon.component.scss']
})
export class ListComingSoonComponent implements OnInit {

  constructor(private router:Router,private dataService:DataService) { }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);
  }

  openSubmenu(){
    this.dataService.openSubmenu();
  }
}
