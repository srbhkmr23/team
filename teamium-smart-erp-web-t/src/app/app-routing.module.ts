import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
// import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { StartTourComponent } from './start-tour/start-tour.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './core/services/auth.guard';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { EditEquipmentComponent } from './edit-equipment/edit-equipment.component';
import { TeamiumComponent } from './teamium/teamium.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { PersonalListComponent } from './personal-list/personal-list.component';
import { ListComingSoonComponent } from './list-coming-soon/list-coming-soon.component';
import { EquipmentPackageComponent } from './equipment-package/equipment-package.component';
import { PersonnelEditComponent } from './personnel-edit/personnel-edit.component';
import { PersonalReelsComponent } from './personal-reels/personal-reels.component';


import { CreateGroupComponent } from './create-group/create-group.component';
import { ProjectBudgetingComponent } from './project-budgeting/project-budgeting.component';
import { ProjectProcurementComponent } from './project-procurement/project-procurement.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { CreateFunctionComponent } from './create-function/create-function.component';
import { ProjectFinancialComponent } from './project-financial/project-financial.component';

import { ShowListComponent } from './show-list/show-list.component';
import { NotificationBuiilderComponent } from './notification-buiilder/notification-buiilder.component';

import { SchedulerComponent } from './scheduler/schedule/scheduler.component';
import { ProjectSchedulerComponent } from './scheduler/project-scheduler/project-scheduler.component';

import { ProjectBookingComponent } from './project-booking/project-booking.component';
import { VendorsComponent } from './vendors/vendors.component';
import { ClientsComponent } from './clients/clients.component';
import { RateCardComponent } from './rate-card/rate-card.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PlanningSchedulerComponent } from './scheduler/planning-scheduler/planning-scheduler.component';
import { EditShowComponent } from './edit-show/edit-show.component';
import { RosterComponent } from './scheduler/roster/roster.component';
import { ProjectAgendaComponent } from './scheduler/project-agenda/project-agenda.component';
import { ProjectEventComponent } from './scheduler/show-project-scheduler/project-event/project-event.component';
import { ShowProgramSchedulerComponent } from './scheduler/show-program-scheduler/show-program-scheduler.component';
import { CallsheetComponent } from './callsheet/callsheet.component';
import { ShowProjectsComponent } from './show-projects/show-projects.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ReportComponent } from './report/report.component';
import { VerticalSchedulerComponent } from './scheduler/schedule/vertical-scheduler/vertical-scheduler.component';
import {FreelanceContractComponent} from './freelance-contract/freelance-contract.component';
import { VendorBiddingComponent } from './vendor-bidding/vendor-bidding.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserSchedulerComponent } from './scheduler/user-scheduler/user-scheduler.component';
import { GroupSchedulerComponent } from './scheduler/group-scheduler/group-scheduler.component';
import { PersonalExpensesComponent } from './personal-expenses/personal-expenses.component';
import { PersonnelLeaveComponent } from './personnel-leave/personnel-leave.component';



const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'start-tour', component: StartTourComponent, canActivate: [AuthGuard] },
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
  {
    path: "signin",
    loadChildren: "./signin.module#SigninModule"
  },
  {
    path: "teamium",
    loadChildren: "./teamium.module#TeamiumModule"
  },
  // {
  //   path: 'teamium', component: TeamiumComponent, canActivate: [AuthGuard],
  //   children: [

  //     { path: 'comming-soon', component: ComingSoonComponent },
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'vendor-dashboard', component: VendorBiddingComponent },
  //     { path: 'user-dashboard', component: UserDashboardComponent },
     

  //     { path: 'create-function', component: CreateFunctionComponent },
  //     { path: 'notification-builder', component: NotificationBuiilderComponent },
  //     { path: 'create-group', component: CreateGroupComponent },
  //     { path: 'configuration', component: ListComingSoonComponent },
  //     { path: 'vendors', component: VendorsComponent },
  //     { path: 'clients', component: ClientsComponent },
  //     { path: 'rate-card', component: RateCardComponent },
  //     { path: 'rate-card/client/:id', component: RateCardComponent },
  //     { path: 'rate-card/vendor/:id', component: RateCardComponent },
  //     { path: 'rate-card/standard', component: RateCardComponent },


  //     { path: 'equipment-list', component: EquipmentListComponent },
  //     { path: 'equipment-details/:id', component: EditEquipmentComponent },
  //     { path: 'equipment-package/:id', component: EquipmentPackageComponent },


  //     { path: 'project-list', component: ProjectListComponent },
  //     { path: 'project-budgeting/:id', component: ProjectBudgetingComponent },
  //     { path: 'project-booking/:id', component: ProjectBookingComponent },
  //     { path: 'project-scheduler/:id', component: ProjectSchedulerComponent },

  //     { path: 'project-financial', component: ProjectFinancialComponent },
  //     { path: 'project-procurement/:id', component: ProjectProcurementComponent },


  //     { path: 'schedule-user', component: UserSchedulerComponent },
  //     { path: 'schedule-list', component: ListComingSoonComponent },
  //     { path: 'schedule-timeline', component: SchedulerComponent },
  //     { path: 'group-schedule', component: GroupSchedulerComponent },
      
  //     { path: 'schedule-program', component: ShowProgramSchedulerComponent },
  //     { path: 'schedule-roster', component: RosterComponent },
  //     { path: 'project-agenda', component: ProjectAgendaComponent },
  //     { path: 'project-event', component: ProjectEventComponent },
  //     { path: 'planning-event', component: VerticalSchedulerComponent },
      
  //     { path: 'show-list', component: ShowListComponent },
  //     { path: 'show-edit/:id', component: EditShowComponent },
  //     { path: 'show-projects/:id', component: ShowProjectsComponent },
      

  //     { path: 'report', component: ReportComponent },
  //     { path: 'report-edit', component: ComingSoonComponent },

  //     { path: 'staff-list', component: PersonalListComponent },
  //     { path: 'staff-edit', component: PersonnelEditComponent },
  //     { path: 'staff-expenses/:id', component: PersonalExpensesComponent },
   

  //     { path: 'staff-leave', component: PersonnelLeaveComponent },

     

  //     { path: 'staff-details/:id', component: PersonnelEditComponent },
  //     { path: 'staff-show-reel/:id', component: PersonalReelsComponent },
  //     { path: 'budgeting/call-sheet/:id',component:CallsheetComponent},
  //     { path: 'booking/call-sheet/:id',component:CallsheetComponent},
  //     { path: 'purchase-order/call-sheet/:id',component:CallsheetComponent}, 
  //     { path: 'create-configuration', component: ConfigurationComponent },
  //     { path: 'freelance-contract/:id', component: FreelanceContractComponent },

 
  //   ]
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
