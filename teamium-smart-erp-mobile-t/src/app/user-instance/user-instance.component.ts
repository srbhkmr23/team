import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonDataService } from '../core/services/common-data.service';

@Component({
  selector: 'app-user-instance',
  templateUrl: './user-instance.component.html',
  styleUrls: ['./user-instance.component.scss']
})
export class UserInstanceComponent implements OnInit {

  public errorMessage: string;
  public userInstanceForm: FormGroup;
  
  constructor(public router: Router,public fb: FormBuilder,public commonDataService: CommonDataService) {
    this.errorMessage = null;
    this.userInstanceForm = this.fb.group({
      userInstance: [null, Validators.required],
      default: [false],
    });
   }

  ngOnInit() {

  }

  submit() {
    this.errorMessage = null;
    this.commonDataService.clearUserInstance();
    this.commonDataService.clearLoggedInUserData();
    
    const formValue = this.userInstanceForm.value;
    const value = formValue.userInstance;
    const defVal = formValue.default || false;

    if(this.commonDataService.isUserInstanceExist(value)){
      this.commonDataService.setUserInstance(value,defVal);
      this.goToSignin();
    }
    else {
      this.commonDataService.showSnackBar('Instance dose not match.','warning')
    }
    
  }

  goDashboard() {
    this.router.navigate(['/teamium']);
  }

  goToSignin(){
    this.router.navigate(['/signin']);
  }

  formValid() {
    if (this.userInstanceForm.valid) {
      return true;
    }
    this.errorMessage = null;
    return false;
  }

}
