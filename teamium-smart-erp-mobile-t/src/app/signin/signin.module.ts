import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin.component';
import {SigninRoutingModule} from './signin-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SharedModule} from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    SigninRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [SigninComponent]
})
export class SigninModule { }
