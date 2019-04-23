import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'angular-highcharts';
import { TextMaskModule } from 'angular2-text-mask';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
// import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { StartTourComponent } from './start-tour/start-tour.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SingleHeaderComponent } from './single-header/single-header.component';
import { DataService } from './data.service';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TokenInterceptor } from './core/services/token-interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { EquipmentFilterPipe } from './core/pipes/equipment-filter.pipe';
import { GlobalSortPipe } from './core/pipes/global-sort.pipe';
import { EquipmentSearchPipe } from './core/pipes/equipment-search.pipe';
import { EquipmentPackageComponent } from './equipment-package/equipment-package.component';
import { EditEquipmentComponent } from './edit-equipment/edit-equipment.component';
import { TeamiumComponent } from './teamium/teamium.component';
import { PersonalListComponent } from './personal-list/personal-list.component';
import { PersonalFilterPipe } from './core/pipes/personal-filter.pipe';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { ListComingSoonComponent } from './list-coming-soon/list-coming-soon.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PopoverModule } from "ngx-popover";

import { CreatePersonnelComponent } from './create-personnel/create-personnel.component';
import { PersonnelEditComponent } from './personnel-edit/personnel-edit.component';
import { CreateEquipmentComponent } from './create-equipment/create-equipment.component';
import { PersonalReelsComponent } from './personal-reels/personal-reels.component';
import { ReelFilterPipe } from './core/pipes/reel-filter.pipe';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";
import { CreateGroupComponent } from './create-group/create-group.component';
import { ProjectBudgetingComponent } from './project-budgeting/project-budgeting.component';
import { CreateProjectBudgetingComponent } from './create-project-budgeting/create-project-budgeting.component';
import { SliderModule } from 'primeng/slider';
import { HttpModule } from '@angular/http';
import { EmbedVideo } from 'ngx-embed-video/dist';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectSearchPipe } from './core/pipes/project-search.pipe';
import { CreateFunctionComponent } from './create-function/create-function.component';
import { TreeModule } from 'primeng/tree';
import { ColorPickerModule } from 'ngx-color-picker';
import { SpinnerComponent } from './spinner/spinner.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { CalendarModule } from 'primeng/calendar';
import { ProjectProcurementComponent } from './project-procurement/project-procurement.component';
import { ProjectFinancialComponent } from './project-financial/project-financial.component';
import { ShowListComponent } from './show-list/show-list.component';
import { NotificationBuiilderComponent } from './notification-buiilder/notification-buiilder.component';

import { DayPilotModule } from 'daypilot-pro-angular';
import { DraggableDirective } from './scheduler/draggable.directive';
import { TaskScheduledEditComponent } from './scheduler/taskscheduled/task-scheduled-edit.component';
import { SchedulerComponent } from './scheduler/schedule/scheduler.component';
import { DatePipe } from '@angular/common';
import { ProjectSchedulerComponent } from './scheduler/project-scheduler/project-scheduler.component';
import { ProjectBookingComponent } from './project-booking/project-booking.component';
import { ClientsComponent } from './clients/clients.component';
import { VendorsComponent } from './vendors/vendors.component';
import { CreateeventComponent } from './scheduler/create-event/createevent.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LineSearchPipe } from './core/pipes/line-search.pipe';
import { CreateClientComponent } from './create-client/create-client.component';
import { Ng2DragDropModule } from 'ng2-drag-drop';
import { CreateVendorComponent } from './create-vendor/create-vendor.component';
import { PlanningSchedulerComponent } from './scheduler/planning-scheduler/planning-scheduler.component';
import { ScheduleModule } from 'primeng/schedule';
import { EditorModule} from 'primeng/editor';
import { FunctionFilterPipe } from './core/pipes/function-filter.pipe';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { RateCardComponent } from './rate-card/rate-card.component';
import { EditShowComponent } from './edit-show/edit-show.component';
import { CreateShowComponent } from './create-show/create-show.component';
import { ShowSearchPipe } from './core/pipes/show-search.pipe';
import { VendorSearchPipe } from './core/pipes/vendor-search-pipe';

import { VendorFilterPipe } from './core/pipes/vendor-filter.pipe';
import { RateFilterPipe } from './core/pipes/rate-filter.pipe';
import { RateSearchPipe } from './core/pipes/rate-search.pipe';

import { RosterComponent } from './scheduler/roster/roster.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { RosterEventComponent } from './scheduler/roster/roster-event/roster-event.component';
import { ProjectAgendaComponent } from './scheduler/project-agenda/project-agenda.component';
import { ProjectEventComponent } from './scheduler/show-project-scheduler/project-event/project-event.component';
import { CreateProjectEventComponent } from './scheduler/show-project-scheduler/create-project-event/create-project-event.component';
import { ShowProgramSchedulerComponent } from './scheduler/show-program-scheduler/show-program-scheduler.component';
import { CallsheetComponent } from './callsheet/callsheet.component';
import { ShowProjectsComponent } from './show-projects/show-projects.component';
import { ShowProjectFilterPipe } from './core/pipes/show-project-filter.pipe';
import { TemplateFilterPipe } from './core/pipes/template-filter.pipe';

import { ClientSearchPipe } from './core/pipes/client-search-pipe';
import { ClientFilterPipe } from './core/pipes/client-filter.pipe';
import { ConfigurationComponent } from './configuration/configuration.component';
import { SaveLabourRuleComponent } from './configuration-components/save-labour-rule/save-labour-rule.component';
import { VerticalSchedulerComponent } from './scheduler/schedule/vertical-scheduler/vertical-scheduler.component';
import { FreelanceContractComponent } from './freelance-contract/freelance-contract.component';
import { GlobalSearchPipe } from './core/pipes/global-search.pipe';
import { ReportComponent } from './report/report.component';
import { VendorBiddingComponent } from './vendor-bidding/vendor-bidding.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { SaveCompanyComponent } from './configuration-components/save-company/save-company.component';
import { SaveDigitalSignature } from './configuration-components/save-digital-signature/save-digital-signature.component';
import { SaveFormatComponent } from './configuration-components/save-format/save-format.component';
import { SaveOrderComponent } from './configuration-components/save-order-form/save-order-form.component';
import { UserSchedulerComponent } from './scheduler/user-scheduler/user-scheduler.component';
import { UserTaskComponent } from './scheduler/user-task/user-task.component';
import { SaveCategoryComponent } from './configuration-components/save-category/save-category.component';
import { SaveProjectMilestonesComponent } from './configuration-components/save-project-milestones/save-project-milestones.component';
import { GroupSchedulerComponent } from './scheduler/group-scheduler/group-scheduler.component';
import { GroupFilterPipe } from './core/pipes/group-filter.pipe';
import { SaveEquipmentMilestonesComponent } from './configuration-components/save-equipment-milestones/save-equipment-milestones.component';
import { PersonalExpensesComponent } from './personal-expenses/personal-expenses.component';
import { ExpensesReportFilterPipe } from './core/pipes/expenses-report-filter.pipe';
import { ExpensesReportDateRangeFilterPipe } from './core/pipes/expenses-report-date-range-filter.pipe';
import { SaverChannelConfiguration } from './configuration-components/save-channel/save-channel.component';
import { PersonnelLeaveComponent } from './personnel-leave/personnel-leave.component';
import {ChatService} from './core/services/chat.service' ;
import { RecurrenceComponent } from './scheduler/recurrence/recurrence.component';
import { SavePersonnelDocumentComponent } from './configuration-components/save-personnel-document/save-personnel-document.component' 
import { SaveDaysOFF } from './configuration-components/save-days-off/save-days-off.component';

import {SharedModule} from './shared.module';
import { SavePersonnelSkillComponent } from './configuration-components/save-personnel-skill/save-personnel-skill.component';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "left",
  allowNegative: false,
  decimal: ".",
  precision: 0,
  prefix: "$",
  suffix: "",
  thousands: ","
};


@NgModule({
  declarations: [
    
    AppComponent,
    // DashboardComponent,
    // HeaderComponent,
    // SidebarComponent,
    // SigninComponent,
    SignupComponent,
    StartTourComponent,
    WelcomeComponent,
    SingleHeaderComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    // EquipmentListComponent,
    // EditEquipmentComponent,
    // EquipmentFilterPipe,
    // GlobalSortPipe,
  //   EquipmentSearchPipe,
  //   EquipmentPackageComponent,
  //   TeamiumComponent,
  //   ComingSoonComponent,
  //   PersonalListComponent,
  //   PersonalFilterPipe,
  //   ListComingSoonComponent,
  //   CreatePersonnelComponent,
  //   PersonnelEditComponent,
  //   CreateEquipmentComponent,
  //   PersonalReelsComponent,
  //   ReelFilterPipe,
  //   CreateGroupComponent,
  //   ProjectBudgetingComponent,
  //   CreateProjectBudgetingComponent,
  //   ProjectListComponent,
  //   ProjectSearchPipe,
  //   CreateFunctionComponent,
  //   SpinnerComponent,
  //   ProjectProcurementComponent,
  //   ProjectFinancialComponent,
  //   ShowListComponent,
  //   NotificationBuiilderComponent,
  //   SchedulerComponent,
  //   DraggableDirective,
  //   TaskScheduledEditComponent,
  //   ProjectSchedulerComponent,
  //   ProjectBookingComponent,
  //   ClientsComponent,
  //   VendorsComponent,
  //   CreateeventComponent,
  
  //   LineSearchPipe,
  //   CreateClientComponent,
  //   CreateVendorComponent,
  //   CreateClientComponent,
  //   PlanningSchedulerComponent,
  //   FunctionFilterPipe,
  //   NotFoundPageComponent,

  //   ShowSearchPipe,
  //   RateCardComponent,
  //   EditShowComponent,
  //   CreateShowComponent,
  //   RateCardComponent,
  //   ShowSearchPipe,
  //   VendorSearchPipe,
  //   VendorFilterPipe,

  //   RateFilterPipe,
  //   RateSearchPipe,
  //   EditShowComponent,
  //   CreateShowComponent,
  //   RosterComponent,
  //   RosterEventComponent,
  //   ProjectAgendaComponent,
  //   ProjectEventComponent,
  //   CreateProjectEventComponent,
  //   ShowProgramSchedulerComponent,
  //   CallsheetComponent,
  //   ShowProjectsComponent,
  //   ShowProjectFilterPipe,
  //   TemplateFilterPipe,
  //   ClientSearchPipe,
  //   ClientFilterPipe,
  //   ConfigurationComponent,
  //   SaveLabourRuleComponent,
  //   VerticalSchedulerComponent,
  //   FreelanceContractComponent,
  //   GlobalSearchPipe,
  //   ReportComponent,
  //   VendorBiddingComponent,
  //   UserDashboardComponent,
  //   SaveCompanyComponent,
  //   SaveDigitalSignature,
  //   SaveFormatComponent,
  //   SaveOrderComponent,
  //   UserSchedulerComponent,
  //   UserTaskComponent,
  //   SaveCategoryComponent,
  //   SaveProjectMilestonesComponent,
  //   GroupSchedulerComponent,
  //   GroupFilterPipe,
  //   SaveEquipmentMilestonesComponent,
  //   PersonalExpensesComponent,
  //   ExpensesReportFilterPipe,
  //   ExpensesReportDateRangeFilterPipe,
  //   SaverChannelConfiguration,
  //   PersonnelLeaveComponent,
  //   RecurrenceComponent,
  //   SavePersonnelDocumentComponent,
  //   SavePersonnelSkillComponent,
  //   SaveDaysOFF


  ],
  imports: [
    BrowserModule,
    FormsModule,
    TextMaskModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    CurrencyMaskModule,
    SliderModule,
    ChartModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    UiSwitchModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,

    TreeModule,
    ColorPickerModule,
    ProgressSpinnerModule,
    BlockUIModule,
    CalendarModule,

    HttpModule,

    EmbedVideo.forRoot(),
    TreeModule,
    ColorPickerModule,
    ProgressSpinnerModule,
    BlockUIModule,
    DayPilotModule,
    Ng2DragDropModule.forRoot(),
    ScheduleModule,
    EditorModule,
    PopoverModule,
    SharedModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    DataService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    DatePipe,
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}