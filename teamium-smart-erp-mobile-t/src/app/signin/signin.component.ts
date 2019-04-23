import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { HttpService } from '../core/services/http.service';
import { Router } from '@angular/router';
import { CommonDataService } from '../core/services/common-data.service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public errorMessage: string;
  public loginForm: FormGroup;
  
  constructor(public router: Router,public fb: FormBuilder, public httpService: HttpService,public commonDataService: CommonDataService) {
    this.errorMessage = null;
    this.loginForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
   }

  ngOnInit() {

  }

  login() {
    this.errorMessage = null;
    if (localStorage.getItem('loggedInUserData')) {
      this.commonDataService.clearLoggedInUserData();
    }

    const formValue = this.loginForm.value;
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('grant_type', "password");
    urlSearchParams.append('username', formValue.username);
    urlSearchParams.append('password', formValue.password);
    let body = urlSearchParams.toString()
    var headers = new HttpHeaders({ 'Authorization': 'Basic ' + 'dGVhbWl1bS1tb2JpbGU6bXlwYXNzQDEyMw==', 'Content-Type': 'application/x-www-form-urlencoded', 'UUID': '1234567890' });
    this.commonDataService.showSpinner();
    this.httpService.callApi('login', { body, headers }).subscribe(
      (response) => {
        if (response['access_token']) {
          localStorage.setItem('token', response['access_token']);
          localStorage.setItem('userId', response['user_id']);
          
          this.httpService.callApi('getLoggedInUser', {}).subscribe((proRes) => {
            this.commonDataService.hideSpinner();
            // this.dataService.isFirstTimeLogIn = responce;
            // if (this.dataService.isUserFirstTimeLogIn()) {
            //   this.goStarttour();
            // } else {
            //   this.goDashboard();
            // }

            // get Name and image Url
            let saveData=response;
            try{
              let firstName = proRes['firstName'] || "";
              let lastName =  proRes['lastName'] || "";
              let fullName =  proRes['fullName'] || "";
              let profileUrl =  proRes['photo'] ? proRes['photo']['url'] : "";
              saveData['firstName'] = firstName;
              saveData['lastName'] =  lastName;
              saveData['fullName'] =  fullName;
              saveData['profileUrl'] = profileUrl;
            }
            catch(ex) {
              console.error(ex)
            }

            this.commonDataService.setLoggedInUserData(saveData);
            this.goDashboard();
            

          }, error => {
            this.commonDataService.hideSpinner();
            console.error('Error getstatus => ', error)
          });

        }
      },
      error => {
        this.commonDataService.hideSpinner();
        console.error('Error  login => ', error)
        this.errorMessage = error.error.error_description;
      }
    );
  }

  goDashboard() {
    this.router.navigate(['/teamium']);
  }

  goToSignup(){
    this.router.navigate(['/signup']);
  }

  formValid() {
    if (this.loginForm.valid) {
      return true;
    }
    this.errorMessage = null;
    return false;
  }

}
