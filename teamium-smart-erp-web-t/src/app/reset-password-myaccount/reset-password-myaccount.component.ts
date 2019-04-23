import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password-myaccount',
  templateUrl: './reset-password-myaccount.component.html',
  styleUrls: ['./reset-password-myaccount.component.scss']
})
export class ResetPasswordMyaccountComponent implements OnInit, OnDestroy {
  @Output() closeModalEvent = new EventEmitter<boolean>();
  resetPasswordForm: FormGroup;
  loggedInUserData: any;
  subscription: Subscription;
  constructor(private httpService: HttpService, private formBuilder: FormBuilder, private toastr: ToastrService) { }

  ngOnInit() {
    this.httpService.callApi('loggedInUser', {}).subscribe(response => {
      this.loggedInUserData = response;
    },error =>{
      this.toastr.error('Unable to load user data','Reset Password');
    });
    this.resetPasswordForm = this.createFormGroup();
    this.subscription = this.password.valueChanges.subscribe(password => {
      this.confirmPassword.reset();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeModal() {
    this.closeModalEvent.emit(false);
  }

  changePassword() {
    if(this.resetPasswordForm.invalid){
      return;
    }
    if(!confirm('You will be logged out. Are you sure?')){
      return;
    }
    let body = JSON.parse(JSON.stringify(this.loggedInUserData));
    body.contractSettingDTO = null;
    body.userSettingDTO.existingPassword = this.existingPassword.value;
    body.userSettingDTO.password = this.password.value;
    body.userSettingDTO.confirmPassword = this.confirmPassword.value;
    this.httpService.callApi('editUserProfile', { pathVariable: body.id, body: body }).subscribe((response) => {
      this.loggedInUserData = response;
      this.toastr.success('Successfully Saved', 'Reset Password');
    }, error => {
      this.toastr.error((error.error.message === 'Incorrect Password'?'Old password does not match':error.error.message), 'Reset Password');
    });
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      existingPassword: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])],
      confirmPassword: [null, Validators.compose([Validators.required])]
    }, { validator: this.passwordMatcher });
  }
  get password() { return this.resetPasswordForm.get('password') };
  get confirmPassword() { return this.resetPasswordForm.get('confirmPassword') };
  get existingPassword() { return this.resetPasswordForm.get('existingPassword') };

  passwordMatcher: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    let password = formGroup.get("password");
    let confirmPassword = formGroup.get("confirmPassword");
    return password && confirmPassword && password.value !== confirmPassword.value ? { 'passwordMatch': true } : null;
  };
}
