import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from "@angular/router";
import { HttpService } from '../core/services/http.service';
import { Validators, FormBuilder, FormGroup,FormControl } from '@angular/forms';
import { ToastrService } from '../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordForm: FormGroup;
  requestedEmailId:any;
  recoveryToken:any;
  vaildRecoveryToken:boolean=true;
   personDTO:any;
  constructor(private route: ActivatedRoute,private fb: FormBuilder,private router :Router,private httpService: HttpService, private toastr: ToastrService) { }

  ngOnInit() {
   this.personDTO={
    "userSettingDTO":{
      "passwordRecoveryToken":"",
      "email":"",
      "password":null,
      "confirmPassword":null
    }
  }
    this.route.queryParams.subscribe(params => {
      this.personDTO.userSettingDTO.email = params.email;

      this.personDTO.userSettingDTO.passwordRecoveryToken=params.token;
      this.requestedEmailId
    });
    this.resetPasswordForm = this.fb.group({
      password: [null],
      confirmPassword: [null, Validators.compose([Validators.required, this.validateAreEqual.bind(this)])],
    });
    this.httpService.callApi('verifyRecoveryLink', {body: this.personDTO}).subscribe(response => {
     console.log("response",response);
      if(response!=true){
        this.vaildRecoveryToken=false;
      }
  
    }, error => {
      console.log(error);
    });
    
  }

  reset(){

    this.personDTO.userSettingDTO.password=this.resetPasswordForm.get('password').value;
    this.personDTO.userSettingDTO.confirmPassword=this.resetPasswordForm.get('confirmPassword').value;
    this.httpService.callApi('resetPassword', {body: this.personDTO}).subscribe(response => {
      this.toastr.success('Successfully reset','Password');
    this.router.navigate(['/signin']);
     
   
     }, error => {
      this.toastr.error(error.error.message,'Password');
       console.log(error);
     });
  }
  goToForgotPassowrd(){
    this.router.navigate(['/forgot-password']);
  }

  goTosignIn(){
    this.router.navigate(['/signin']);
  }
  goSignup() {
    this.router.navigate(['signup']);
  }
  private validateAreEqual(fieldControl: FormControl) {
    return (typeof this.resetPasswordForm != 'undefined' && this.resetPasswordForm.get('confirmPassword').value === this.resetPasswordForm.get('password').value) ? null : {
      NotEqual: true
    };
  }

}
