import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '../../node_modules/@angular/router';

import {AssignToMeComponent} from './assign-to-me/assign-to-me.component';
import {ToolsComponent} from './tools/tools.component';
import {HomeComponent} from './home/home.component';
import {JobsComponent} from './jobs/jobs.component';
import {PersonalEditComponent} from './personal-edit/personal-edit.component';
import {PersonalScheduleComponent} from './personal-schedule/personal-schedule.component';
import {CallSheetComponent} from './call-sheet/call-sheet.component';
import {TaskComponent} from './task/task.component';
import {TaskDetailsComponent} from './task-details/task-details.component';
import {ChatMessageComponent} from './chat-message/chat-message.component';
import {NotificationComponent} from './notification/notification.component';
import {ChatUserListComponent} from './chat-user-list/chat-user-list.component';
import {ProjectDetailsComponent} from './project-details/project-details.component';
import {ProjectBookingComponent} from './project-booking/project-booking.component';
import { AuthGuardService } from './core/services/auth-guard.service';
const routes: Routes = [
  { path: "", component: AssignToMeComponent,canActivate: [AuthGuardService]},
  { path: "tools", component: ToolsComponent,canActivate: [AuthGuardService]},
  { path: "home", component: HomeComponent,canActivate: [AuthGuardService]},
  { path: "jobs", component: JobsComponent,canActivate: [AuthGuardService]},
  { path: "personal-edit", component: PersonalEditComponent,canActivate: [AuthGuardService]},
  { path: "personal-schedule", component: PersonalScheduleComponent,canActivate: [AuthGuardService]},
  { path: "call-sheet", component: CallSheetComponent,canActivate: [AuthGuardService]},
  { path: "task", component: TaskComponent,canActivate: [AuthGuardService]},
  { path: "task-details/:id", component: TaskDetailsComponent,canActivate: [AuthGuardService]},
  { path: "chat-message", component: ChatMessageComponent,canActivate: [AuthGuardService]},
  { path: "notification", component: NotificationComponent,canActivate: [AuthGuardService]},
  { path: "chat-user-list", component: ChatUserListComponent,canActivate: [AuthGuardService]},
  { path: "project-details", component: ProjectDetailsComponent,canActivate: [AuthGuardService]},
  { path: "project-booking", component: ProjectBookingComponent,canActivate: [AuthGuardService]}
];
@NgModule({
  exports: [RouterModule],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class TeamiumRoutingModule { }
