import { Component, OnInit, ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-teamium',
  templateUrl: './teamium.component.html',
  styleUrls: ['./teamium.component.scss']
})
export class TeamiumComponent implements OnInit {

  public activeMenu: string;


  constructor(private cdr: ChangeDetectorRef) {

  }
  ngOnInit() {
  }

  changeMenuItem($event) {
    this.activeMenu = $event;
    this.cdr.detectChanges();
  }

}