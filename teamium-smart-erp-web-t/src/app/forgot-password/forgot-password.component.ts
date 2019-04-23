import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { DataService } from '../core/services/data.service';
import { HttpService } from '../core/services/http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from '../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  blockedPanel:boolean=false;
  public forgotPasswordForm: FormGroup;
  public myInnerHeight: any;
  isMailSent:boolean=false;
  constructor(private router: Router, private fb: FormBuilder, private dataService: DataService, private httpService: HttpService, private toastr: ToastrService) { }
   
  ngOnInit() {
  
    this.forgotPasswordForm = this.fb.group({
      email: [null,  Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z0-9]+(\\.[a-zA-Z0-9]{1,})*(\\.[a-zA-Z0-9]{1,})*@[a-zA-Z0-9]+(\\.[a-zA-Z0-9]+)*(\\.[a-zA-Z0-9]{2,})$")])]
    });
    this.forgotPasswordForm.valueChanges.subscribe(console.log);
  }
  onResize(event) {
    this.myInnerHeight = event.target.innerHeight;
  }

  sendMail(){
    this.blockedPanel=true;
    let personDTO={
      "userSettingDTO":{
        "email":this.forgotPasswordForm.get('email').value
      }
    }
    this.httpService.callApi('sendForgotPasswordLink', {body: personDTO}).subscribe(response => {
      this.toastr.success("Password recovery request has been sent on your email successfully");
      this.blockedPanel=false;
      this.isMailSent=true;
  
    }, error => {
      this.toastr.error(error.error.message,"Opps...!");
      this.blockedPanel=false;
      console.log(error);
    });
  }
  goTosignIn(){
    this.router.navigate(['/signin']);
  }
  goSignup() {
    this.router.navigate(['signup']);
  }

}
