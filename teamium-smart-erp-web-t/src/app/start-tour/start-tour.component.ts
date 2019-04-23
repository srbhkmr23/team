import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-start-tour',
  templateUrl: './start-tour.component.html',
  styleUrls: ['./start-tour.component.scss']
})
export class StartTourComponent implements OnInit {



  constructor(public router: Router) {

   }

  public myInnerHeight: any;

  ngOnInit() {
    this.myInnerHeight = window.innerHeight;
  }

  onResize(event){
    this.myInnerHeight = event.target.innerHeight;
  }
  goToWelcomeScreen(){
    this.router.navigate(['welcome']);
  }

}
