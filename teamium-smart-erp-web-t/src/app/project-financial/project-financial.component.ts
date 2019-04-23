import { Component, OnInit } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-project-financial',
  templateUrl: './project-financial.component.html',
  styleUrls: ['./project-financial.component.scss']
})
export class ProjectFinancialComponent implements OnInit {

  constructor(private router:Router,private dataService: DataService) { }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);
  }

}
