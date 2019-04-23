import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { DataService } from '../core/services/data.service';
import { HttpService } from '../core/services/http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public myInnerHeight: any;
  public errorMessage: string;
  // public username: string;
  // public password: string;
  public loginForm: FormGroup;
  constructor(private router: Router, private fb: FormBuilder, private dataService: DataService, private httpService: HttpService, private httpClient: HttpClient) { }

  ngOnInit() {
    this.errorMessage = null;
    this.myInnerHeight = window.innerHeight;
    this.loginForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }
  onResize(event) {
    this.myInnerHeight = event.target.innerHeight;
  }

  goSignup() {
    this.router.navigate(['signup']);
  }
  login() {
    this.errorMessage = null;
    if (sessionStorage.getItem('token')) {
      sessionStorage.clear();
    }

    const formValue = this.loginForm.value;
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('grant_type', "password");
    urlSearchParams.append('username', formValue.username);
    urlSearchParams.append('password', formValue.password);
    let body = urlSearchParams.toString()
    var headers = new HttpHeaders({ 'Authorization': 'Basic ' + 'dGVhbWl1bS13ZWI6bXlwYXNzQDEyMw==', 'Content-Type': 'application/x-www-form-urlencoded', 'UUID': '1234567890' });

    this.httpService.callApi('login', { body, headers }).subscribe(
      (response) => {
        if (response['access_token']) {

          sessionStorage.setItem('token', response['access_token']);
          sessionStorage.setItem('userId', response['user_id']);
          this.dataService.isLoggedIn = true;

          this.httpService.callApi('getstatus', {}).subscribe((responce) => {
            this.dataService.isFirstTimeLogIn = responce;
            if (this.dataService.isUserFirstTimeLogIn()) {
              this.goStarttour();
            } else {
              this.goDashboard();
            }
          }, error => {
            console.log('Error getstatus => ', error)
          });

        }
      },
      error => {
        console.log('Error  login => ', error)
        this.errorMessage = error.error.error_description;
      }
    );
  }

  goDashboard() {
    this.router.navigate(['/teamium/dashboard']);
  }

  goStarttour() {
    this.router.navigate(['start-tour']);
  }

  formValid() {
    if (this.loginForm.valid) {
      return true;
    }
    this.errorMessage = null;
    return false;
  }

  goForgotPassword(){
    this.router.navigate(['/forgot-password']);
  }
}