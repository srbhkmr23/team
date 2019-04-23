import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public contentInnerHeight: any;
  public username: string;
  public email: string;
  public password: string;
  
  constructor(private router: Router) { }

  ngOnInit() {
    this.contentInnerHeight = window.innerHeight ;
    this.username = "";
    this.email = "";
    this.password = "" ;
  }

  onResize(event) {
    this.contentInnerHeight = event.target.innerHeight;
  }

  goSignin(){
    this.router.navigate(['signin']);
  }
}
