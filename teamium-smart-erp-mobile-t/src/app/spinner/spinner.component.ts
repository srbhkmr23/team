import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  color = 'red';
  mode = 'indeterminate';
  value = 10;
  constructor() { 

  }
  ngOnInit() {
  }

}
 