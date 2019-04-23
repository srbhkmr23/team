import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// import {ChartModule} from 'angular-highcharts';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ColorPickerModule } from 'ngx-color-picker';
import { GlobalSearchPipe } from './core/pipes/global-search.pipe';
import { TextMaskModule } from 'angular2-text-mask';
import { Ng2DragDropModule } from 'ng2-drag-drop';
import { SliderModule } from 'primeng/slider';;
import { TreeModule } from 'primeng/tree';
import { BlockUIModule } from 'primeng/blockui';
import { CalendarModule } from 'primeng/calendar';
import { ScheduleModule } from 'primeng/schedule';
import { PopoverModule } from "ngx-popover";
import { DayPilotModule } from 'daypilot-pro-angular';




import { SpinnerComponent } from './spinner/spinner.component';
import { TeamiumComponent } from './teamium/teamium.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ShowSearchPipe } from './core/pipes/show-search.pipe';
import { CreateShowComponent } from './create-show/create-show.component';
import { CreateProjectBudgetingComponent } from './create-project-budgeting/create-project-budgeting.component';
import { ProjectSearchPipe } from './core/pipes/project-search.pipe';


const routes: Routes = [{

}];

@NgModule({
  exports: [RouterModule],
  imports: []
})
export class SharedRoutingModule {}

@NgModule({
  imports:      [ 
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    ColorPickerModule,TextMaskModule,
    Ng2DragDropModule.forRoot(),
    SliderModule,
    TreeModule,
    BlockUIModule,
    CalendarModule,
    PopoverModule,
    DayPilotModule,
    ScheduleModule,
   ],
   declarations: [
    // TeamiumComponent,
    // SidebarComponent,
    // HeaderComponent,
    SpinnerComponent,
    // ShowSearchPipe,
    // CreateShowComponent,
    // CreateProjectBudgetingComponent,
    // ProjectSearchPipe

  ],
  exports: [ 
    // TeamiumComponent,
    // SidebarComponent,
    // HeaderComponent,
    SpinnerComponent,
    // ShowSearchPipe,
    // CreateShowComponent,
    // CreateProjectBudgetingComponent,
    // ProjectSearchPipe
    
  ]
})
export class SharedModule {}