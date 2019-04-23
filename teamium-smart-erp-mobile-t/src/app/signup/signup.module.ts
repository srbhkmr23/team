import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup.component';
import {SignupRoutingModule} from './signup-routing.module'
import {SharedModule} from '../shared.module';
@NgModule({
  imports: [
    CommonModule,
    SignupRoutingModule,
    SharedModule
  ],
  declarations: [SignupComponent]
})
export class SignupModule { }
