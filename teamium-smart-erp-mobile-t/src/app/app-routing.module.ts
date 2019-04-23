import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './core/services/auth-guard.service';
import {InstanceGuardService} from './core/services/instance-guard.service';
import {LoginGuardService} from './core/services/login-guard.service';

import {UserInstanceComponent} from './user-instance/user-instance.component'
const routes: Routes = [
  { path: '', redirectTo: '/user-instance', pathMatch: 'full' },
  {
    path: "user-instance",
    component: UserInstanceComponent,
    canActivate: [InstanceGuardService]
  },
  {
    path: "signin",
    loadChildren: "./signin/signin.module#SigninModule",
    canActivate: [LoginGuardService]
  },
  {
    path: "signup",
    loadChildren: "./signup/signup.module#SignupModule"
  },
  {
    path: "teamium",
    loadChildren: "./teamium.module#TeamiumModule",
    canActivate: [AuthGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
