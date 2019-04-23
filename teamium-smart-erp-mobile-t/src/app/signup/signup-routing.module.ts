import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '../../../node_modules/@angular/router';
import { SignupComponent } from './signup.component';
const routes: Routes = [
  { path: "", component: SignupComponent}
];
@NgModule({
  exports: [RouterModule],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class SignupRoutingModule { }
 