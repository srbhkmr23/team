import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { DayPilotSchedulerComponent, DayPilot } from 'daypilot-pro-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../core/services/http.service';
import * as moment from 'moment-timezone';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-show-program-scheduler',
  templateUrl: './show-program-scheduler.component.html',
  styleUrls: ['./show-program-scheduler.component.scss']
})
export class ShowProgramSchedulerComponent implements OnInit {

  @ViewChild("scheduler") scheduler: DayPilotSchedulerComponent;
  events: any[] = [];
  programForm: FormGroup;
  formats: any = ['Years/Months/Days', 'Months/Days', 'Days/Hours', 'Days/Hours/30Min', 'Days/Hours/15Min'];
  blockedPanel: boolean;
  programs: any = [];
  searchText:string="";

  config: any = {
    eventResizeHandling: "Disabled",
    eventMoveHandling: "Disabled",
    durationBarMode: "PercentComplete",
    useEventBoxes: "Never",
    snapToGrid: false,
    eventHeight: 65,
    cellWidthSpec: "Fixed",
    cellWidth: 60,
    timeHeaders: [
      {
        "groupBy": "Month",
      },
      {
        "groupBy": "Day",
        "format": "d"
      }
    ],

    scale: "Day",
    cellDuration: 15,

    rowHeaderColumns: [
      { name: 'Project' }
    ],
    locale: "en-us",
    days: DayPilot.Date.today().daysInMonth(),
    businessWeekends: false,
    startDate: '2018-08-01',
    showNonBusiness: true,
    businessBeginsHour: 0,
    businessEndsHour: 24,
    treeEnabled: true,
    allowMultiSelect: true,
    eventClickHandling: "Select",
    eventDoubleClickHandling: "Enabled",
    bubble: new DayPilot.Bubble({
      showAfter: 500,
      cssOnly: true,
      cssClassPrefix: "bubble_default",
      onLoad: args => {
        args.html = "<div style='padding: 0px 0px 0px 2px;color: black;'><span>" + args.source.data.text + "</span><br><span class='task-duration'>" + this.formatDuration(new DayPilot.Duration(args.source.data.start, args.source.data.end).totalMinutes()) + " (" + moment(args.source.data.start.value).format('hh:mm a').toUpperCase() + " - " + moment(args.source.data.end.value).format('hh:mm a').toUpperCase() + ")" + "</span></div>";
      }
    }),
    onBeforeEventRender: args => {
      // args.data.backColor = args.data.color;

      let color = "rgba(" + this.hexToR(args.data.color) + ", " + this.hexToG(args.data.color) + ", " + this.hexToB(args.data.color) + ",0.5)";
      args.data.backColor = color;

      args.data.barColor = args.data.color;
      args.data.barBackColor = '#c3c3c3';
      // let string1 = "<div  class=" + (args.data.selected ? "'test selected'" : "'test'") + " style='color: #fff;'><span>" + args.data.text + "</span></div>";
      args.data.html = "<div  class=" + (args.data.selected ? "'test selected'" : "'test'") + " style='color: #fff;'><span>" + args.data.text + "</span></div>";

    },
    onBeforeEventExport: args => {
      let ts = args.e.data.text.toString().replace("\n", "");
      args.text = ts + "\n" + this.formatDuration(new DayPilot.Duration(args.e.data.start, args.e.data.end).totalMinutes()) + "\n" + " (" + moment(args.e.data.start.value).format('hh:mm a') + " - " + moment(args.e.data.end.value).format('hh:mm a') + ")";
      args.fontStyle = "bold";
      args.fontColor = "#fff";
    },
    onEventSelected: args => {
      this.router.navigate(["teamium/project-scheduler/" + args.e.data.id]);
    }
  };

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private router: Router, private httpService: HttpService, private formBuilder: FormBuilder, public datepipe: DatePipe, private dataService: DataService) {

  }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);
    this.programForm = this.formBuilder.group({
      date: [null],
      program: [null],
      format: 'Months/Days',
    });

    this.dataService.dropDownValueChange.subscribe(value => {
      let functionValue = this.programForm.get('program').value;

      if (value) {
        if (!functionValue || functionValue != value.id) {
          this.programForm.get('program').setValue(value.id);
        }
      } else {
        this.programForm.get('program').setValue(null);
        this.config.resources = [];
        this.events = [];
        // this.cdr.detectChanges();
      }
    });

    this.programForm.get('date').valueChanges.subscribe((value) => {
      let change = this.datepipe.transform(value, 'yyyy-MM-dd');
      let offset = new DayPilot.Date(change).daysInMonth()
      this.config.days = offset;
      this.config.startDate = change;
    });

    this.programForm.get('program').valueChanges.subscribe((value) => {
      if (value) {
        this.createProgramScheduler(value);
      }
      // console.log('value => ', value)
    });

    this.programForm.get('format').valueChanges.subscribe((value) => {
      switch (value) {
        case "Years/Months/Days": {
          this.config.timeHeaders = [
            {
              "groupBy": "Year"
            },
            {
              "groupBy": "Month"
            },
            {
              "groupBy": "Day",
              "format": "d"
            }
          ],
            this.config.scale = "Day"
          break;
        }
        case "Months/Days": {
          this.config.timeHeaders = [
            {
              "groupBy": "Month",
            },
            {
              "groupBy": "Day",
              "format": "d"
            }
          ],
            this.config.scale = "Day"
          break;
        }
        case "Days/Hours": {
          this.config.timeHeaders = [
            {
              "groupBy": "Day",
              "format": "dddd, d MMMM yyyy"
            },
            {
              "groupBy": "Hour"
            }
          ],
            this.config.scale = "Hour";
          break;
        }
        case "Days/Hours/30Min": {
          this.config.timeHeaders = [
            {
              "groupBy": "Day",
              "format": "dddd, d MMMM yyyy"
            },
            {
              "groupBy": "Hour"
            },
            {
              "groupBy": "Cell",
              "format": "mm"
            }
          ],
            this.config.scale = "CellDuration";
          this.config.cellDuration = 30;
          break;
        }
        case "Days/Hours/15Min": {
          this.config.timeHeaders = [
            {
              "groupBy": "Day",
              "format": "dddd, d MMMM yyyy"
            },
            {
              "groupBy": "Hour"
            },
            {
              "groupBy": "Cell",
              "format": "mm"
            }
          ],
            this.config.scale = "CellDuration";
          this.config.cellDuration = 15;
          break;
        }
      }
    });

    let dropdownDataAPI = this.httpService.callApi('getProjectDropdown', {});

    this.blockedPanel = true;
    forkJoin([dropdownDataAPI]).subscribe((responseList) => {
      this.blockedPanel = false;
      this.programs = responseList[0].programs;
      if (this.programs[0]) {
        this.programForm.get('program').setValue(this.programs[0].id);
      }
    }, (errorList) => {
      console.log('errorList => ', errorList)
      this.blockedPanel = false;
    });

  }

  createProgramScheduler(programid) {
    this.blockedPanel = true;
    this.httpService.callApi('getAllProgramEvent', { pathVariable: '/' + programid }).subscribe((response) => {
      // console.log('response => ', response);
      this.config.resources = response.resourceDTOs;
      this.events = response.programEventDTOs;
      this.events.forEach(element => {
        element.start = new DayPilot.Date(moment(element.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss"));
        element.end = new DayPilot.Date(moment(element.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss"));
      });
      let eventVaue = null;
      if (this.events.length > 0) {
        eventVaue = this.events.length == 1 ? this.events[0] : this.events.sort((el1, el2) => {
          if (el1.start > el2.start) {
            return 1;
          } else if (el1.start < el2.start) {
            return -1;
          }
          return 0;
        })[0];
        // console.log('eventVaue => ', eventVaue)
        this.programForm.get('date').setValue(new Date(eventVaue.start.value));
      }



      this.blockedPanel = false;
      // this.cdr.detectChanges();
    }, (error) => {
      this.blockedPanel = false;
      // this.cdr.detectChanges();
    });
  }

  print() {
    this.scheduler.control.exportAs("svg").print();
  }

  formatDuration(minutes: number): string {
    let result = Math.floor((minutes / (60 * 24))) + "d " + Math.floor((minutes % (60 * 24)) / 60) + "h " + Math.floor(minutes % 60) + "m";
    return result;
  }

  hexToR(h) { return parseInt((this.cutHex(h)).substring(0, 2), 16) }
  hexToG(h) { return parseInt((this.cutHex(h)).substring(2, 4), 16) }
  hexToB(h) { return parseInt((this.cutHex(h)).substring(4, 6), 16) }
  cutHex(h) { return (h.charAt(0) == "#") ? h.substring(1, 7) : h }
}
