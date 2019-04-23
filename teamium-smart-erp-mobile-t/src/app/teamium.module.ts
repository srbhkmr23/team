import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DayPilotModule } from 'daypilot-pro-angular';

import { CommonModule } from '@angular/common';
import { AssignToMeComponent } from './assign-to-me/assign-to-me.component';
import {TeamiumRoutingModule} from './teamium-routing.module';
import { HomeComponent } from './home/home.component';
import { JobsComponent } from './jobs/jobs.component';
import { PersonalEditComponent } from './personal-edit/personal-edit.component';
import {PersonalScheduleComponent} from './personal-schedule/personal-schedule.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarToggleComponent } from './sidebar-toggle/sidebar-toggle.component';
import { CallSheetComponent } from './call-sheet/call-sheet.component';
import { TaskComponent } from './task/task.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { ChatUserListComponent } from './chat-user-list/chat-user-list.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import {SharedModule} from './shared.module';
import { OuterClickDirective } from './core/directive/outer-click.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ProfilePicComponent } from './profile-pic/profile-pic.component';
import { FunctionModalComponent } from './personal-edit-modals/function-modal/function-modal.component';
import { SkillsModalComponent } from './personal-edit-modals/skills-modal/skills-modal.component';
import { LanguageModalComponent } from './personal-edit-modals/language-modal/language-modal.component';
import { ToolsComponent } from './tools/tools.component';
import { PersonalScheduleModalComponent } from './personal-schedule-modal/personal-schedule-modal.component';
import { NotificationComponent } from './notification/notification.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectBookingComponent } from './project-booking/project-booking.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    TeamiumRoutingModule,
    SharedModule,
    NgCircleProgressModule.forRoot({}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    DayPilotModule
  ],
  declarations: [AssignToMeComponent, HomeComponent, JobsComponent, FooterComponent, SidebarComponent, SidebarToggleComponent,PersonalEditComponent, PersonalScheduleComponent, CallSheetComponent, TaskComponent, TaskDetailsComponent, ChatMessageComponent, ChatUserListComponent, OuterClickDirective, PersonalScheduleComponent, ProfilePicComponent, FunctionModalComponent, SkillsModalComponent, LanguageModalComponent, ToolsComponent, PersonalScheduleModalComponent,NotificationComponent, ProjectDetailsComponent, ProjectBookingComponent],
  entryComponents:[FunctionModalComponent, SkillsModalComponent, LanguageModalComponent,PersonalScheduleModalComponent]


})
export class TeamiumModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}