import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { SingleHeaderComponent } from '../single-header/single-header.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(public router: Router) {

   }

  ngOnInit() {
  }

  goSignin(){
    this.router.navigate(['/teamium/dashboard']);
  }
}
