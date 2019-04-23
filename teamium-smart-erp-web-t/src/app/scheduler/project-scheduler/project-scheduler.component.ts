import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild, AfterViewChecked, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DayPilot, DayPilotSchedulerComponent } from "daypilot-pro-angular";
import * as moment from 'moment-timezone';
import { ToastrService } from "ngx-toastr";
import { forkJoin } from "../../../../node_modules/rxjs";
import { DataService } from "../../core/services/data.service";
import { HttpService } from "../../core/services/http.service";
import { CreateeventComponent } from "../create-event/createevent.component";
import { TaskScheduledEditComponent } from "../taskscheduled/task-scheduled-edit.component";

@Component({
  selector: 'project-scheduler-component',
  templateUrl: './project-scheduler.component.html',
  styleUrls: ['./project-scheduler.component.scss']
})
export class ProjectSchedulerComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild("scheduler") scheduler: DayPilotSchedulerComponent;
  @ViewChild("editScheduled") editScheduled: TaskScheduledEditComponent;
  @ViewChild("createScheduled") createScheduled: CreateeventComponent;

  changeDate: boolean = true;
  events: any[] = [];
  openOpion: boolean = false;
  linkEventForm: FormGroup;
  linkEventValue: any;
  linkedEventsList: any = [];
  linkingEventsList: any = [];
  projectListInfo: any;
  splitEventValue: any;
  splitForm: FormGroup;
  isClick: false;
  copyEvent: any = null;
  timeLineForm: FormGroup;
  blockedPanel: boolean;
  heights: any = [50, 70, 100];
  formats: any = ['Years/Months/Days', 'Months/Days', 'Week/Days', 'Week/Half Days', 'Week/4 Hours', 'Week/Hours', 'Days/Hours/30Min', 'Days/Hours/15Min'];
  defaultId: number = 0;
  projectId: number = 0;
  functionDropdownData: any;
  functionDropdowApi: any;
  getProjectResourcesApi: any;
  getProjectEventApi: any;
  projectName: any;
  scheduleNotAvailable = false;
  scheduleNotAvailableMessage = 'No schedule available.'
  multipleSelect: any = [];

  config: any = {
    // eventResizeHandling: "Disabled",
    // eventMoveHandling: "Disabled",
    // theme: "testtheme",
    // theme: "testtheme",
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
      { name: 'Function' }
      ,
      { name: 'Resource' }
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
      cssOnly: true,
      cssClassPrefix: "bubble_default",

      onLoad: args => {
        let imageUrl;
        let html;
        if (args.source.data.resourceUrl) {
          imageUrl = args.source.data.resourceUrl;
          html = "<div><img src='" + imageUrl + "' class='alertImageIcon' style='   position: absolute; top:6px;left:2px;  width: 20px !important; height: 20px;' alt=''>";
        } else {
          imageUrl = args.source.data.functionType == 'equipment' ? '../../assets/img/image_icon.png' : args.source.data.functionType == 'staff' ? '../../assets/img/personal.png' : null;
          if (imageUrl)
            html = "<div><img src='" + imageUrl + "' class='alertImageIcon' style='   position: absolute; top:6px;left:2px;  width: 20px !important; height: 20px;' alt=''>";
        }

        let string = args.source.data.collapse ? '../../assets/img/alert-icon.png' : '';

        if (string) {
          if (html) {
            html += "<img src='" + string + "' class='alertImageIcon' style='position: absolute; top:27px;left:2px;  width: 20px !important; height: 20px;' alt=''></div>";
          } else {
            html = "<img src='" + string + "' class='alertImageIcon' style='position: absolute; top:6px;left:2px;  width: 20px !important; height: 20px;' alt=''>"
          }
        }
        args.html = html ? html + "<div style='padding: 0px 0px 0px 25px;color: black;'><span>" + args.source.data.text + " (" + args.source.data.completion + "%)" + "</span><br><span class='task-duration'>" + this.formatDuration(new DayPilot.Duration(args.source.data.start, args.source.data.end).totalMinutes()) + " (" + moment(args.source.data.start.value).format('hh:mm a').toUpperCase() + " - " + moment(args.source.data.end.value).format('hh:mm a').toUpperCase() + ")" + "</span></div>" : "<div style='padding: 0px 0px 0px 2px;color: black;'><span>" + args.source.data.text + " (" + args.source.data.completion + "%)" + "</span><br><span class='task-duration'>" + this.formatDuration(new DayPilot.Duration(args.source.data.start, args.source.data.end).totalMinutes()) + " (" + moment(args.source.data.start.value).format('hh:mm a').toUpperCase() + " - " + moment(args.source.data.end.value).format('hh:mm a').toUpperCase() + ")" + "</span></div>";
      }
    }),

    onEventSelect: args => {
      let selected = this.scheduler.control.multiselect.events();
      let onlyThis = !args.selected && !args.ctrl && !args.meta;
      if (selected.length > 0 && selected[0].resource() !== args.e.resource() && !onlyThis) {
        this.scheduler.control.message("You can only select events from the same row.");
        args.preventDefault();
      }
    },
    onBeforeEventRender: args => {
      args.data.cssClass = args.data.selected ? "myclass" : "";
      args.data.complete = args.data.completion;
      // args.data.backColor = args.data.selected ? "#59c3ea" : args.data.theme;
      if (args.data.selected) {
        args.data.backColor = "#59c3ea";
      } else {
        // let color = !args.data.theme?"black":"rgba(" + this.hexToR(args.data.theme) + ", " + this.hexToG(args.data.theme) + ", " + this.hexToB(args.data.theme) + ",0.5)";
        args.data.backColor = args.data.theme;
      }
      let html;
      let imageUrl;
      let linkShiftPos = 8;
      if (args.data.resourceUrl) {
        imageUrl = args.data.resourceUrl;
        html = "<div><img src='" + imageUrl + "' class='alertImageIcon' alt=''>";
        linkShiftPos = 38;
      } else {
        linkShiftPos = 38;
        imageUrl = args.data.functionType == 'equipment' ? '../../assets/img/image_icon.png' : args.data.functionType == 'staff' ? '../../assets/img/personal.png' : null;
        if (imageUrl)
          html = "<div><img src='" + imageUrl + "' class='alertImageIcon'  alt=''>";
      }

      let string = args.data.collapse ? '../../assets/img/alert-icon.png' : '';
      if (string) {
        if (html) {
          linkShiftPos = 58;
          html += "<img src='" + string + "' class='projectAlertImageIcon'  alt=''></div>";
        } else {
          linkShiftPos = 38;
          html = "<img src='" + string + "' class='alertImageIcon'  alt=''>"
        }
      }

      let string1 = "<div  class=" + (args.data.selected ? "'test selected'" : "'test'") + " style='color: #fff;'><span>" + args.data.text + "</span></div>";
      args.data.html = html ? html + string1 : string1;
      // args.data.html = (html ? html + "<div style='padding: 5px 0px 0px 25px;color: #fff;'><span>" + args.data.text + "</span><br><span class='task-duration'>" + this.formatDuration(new DayPilot.Duration(args.data.start, args.data.end).totalMinutes()) + "</span><br><span> (" + moment(args.data.start.value).format('hh:mm a').toUpperCase() + " - " + moment(args.data.end.value).format('hh:mm a').toUpperCase() + ")" + "</span></div>" : "<div style='padding: 5px 0px 0px 3px;color: #fff;'><span>" + args.data.text + "</span><br><span class='task-duration'>" + this.formatDuration(new DayPilot.Duration(args.data.start, args.data.end).totalMinutes()) + "</span><br><span> (" + moment(args.data.start.value).format('hh:mm a').toUpperCase() + " - " + moment(args.data.end.value).format('hh:mm a').toUpperCase() + ")" + "</span></div>");
      let el = this.link.find(el => el.from == args.data.id || el.to == args.data.id);
      if (el) {
        args.data.areas = [
          { bottom: 9, left: linkShiftPos, icon: "fa fa-link", style: "font-size: 15px;color:#fff" }
        ];
      }

      args.data.barColor = args.data.status ? this.getStatusCode(args.data.status) : args.data.theme;
      args.data.barBackColor = args.data.status ? this.getStatusCode(args.data.status, true) : args.data.theme;

    }, onBeforeEventExport: args => {
      let ts = args.e.data.text.toString().replace("\n", "");
      args.text = ts + "\n" + this.formatDuration(new DayPilot.Duration(args.e.data.start, args.e.data.end).totalMinutes()) + "\n" + " (" + moment(args.e.data.start.value).format('hh:mm a') + " - " + moment(args.e.data.end.value).format('hh:mm a') + ")";
      args.fontStyle = "bold";
      args.fontColor = "#fff";
    },
    onBeforeRowHeaderRender: args => {
      if (args.row.data.function) {
        args.row.columns[0].html = args.row.data.name1;
      }
    },
    onEventDoubleClick: args => {
      this.changeDate = false;
      let project = this.projectListInfo.find(el => el.id == args.e.data.projectId);
      let functions = this.functionDropdownData.find(element => element.function.id == args.e.data.functionId);
      let functionName = functions.function;
      let resource = functions.resources;
      let test = {
        projectList: this.projectListInfo,
        data: args.e.data,
        resources: resource,
        functionName: functionName,
        functionDropdown: this.functionDropdownData,
        projectName: project.id ? project.id : null
      }
      this.editScheduled.show(test).subscribe(result => {
        if (!result) {
          return; // cancelled
        }
        this.saveBookingEvents(result);
      });
    }, onEventClick: args => {
      // console.log('this.timeLineForm.get().value => ',this.timeLineForm.get('selectMultiple').value)
      if (this.timeLineForm.get('selectMultiple').value) {
        let index = this.multipleSelect.findIndex(i => i.id == args.e.data.id);
        if (index > -1) {
          args.e.data.selected = false;
          this.multipleSelect.splice(index, 1);
        } else {
          args.e.data.selected = true;
          this.multipleSelect.push(args.e.data)
        }
        // console.log(' this.multipleSelect => ', args.e.data)
      }
    },
    onEventMoving: args => {
      let allowedMoveable = this.timeLineForm.get('moveable').value;
      args.allowed = allowedMoveable;

      args.left.enabled = allowedMoveable;
      args.right.enabled = allowedMoveable;
      if (allowedMoveable) {
        args.left.html = moment(args.start.value).format('MMMM DD, YYYY hh:mm a');
        args.right.html = moment(args.end.value).format('MMMM DD, YYYY hh:mm a');
      }
    },
    onEventMove: args => {
      if (args.e.data.projectStatus == "Done") {
        this.toastr.warning(args.e.data.projectStatus == "Done" ? "Booking is in Done state." : "Please switch off manual update.")
        args.newStart = args.e.data.start;
        args.newEnd = args.e.data.end;
        return;
      }
      this.changeDate = false;
      let params = {
        id: args.e.id(),
        start: args.newStart,
        end: args.newEnd,
        resource: args.e.data.resourceId,
        theme: args.e.data.theme,
        text: args.e.data.text,
        startTime: moment(args.newStart.value).tz("Asia/Calcutta").format(),
        endTime: moment(args.newEnd.value).tz("Asia/Calcutta").format(),
        changeable: true,
        moveLinkedEvent: true,
        completion: args.e.data.completion,
        comment: args.e.data.comment
      };
      this.saveOrUpdateEvent([params]);
    },
    onEventResizing: args => {
      let allowedResize = this.timeLineForm.get('resizable').value;
      if (allowedResize) {
        let start = new Date(args.start.value);
        let end = new Date(args.end.value);
        if (start > end) {
          allowedResize = false;
        }
      }
      args.allowed = allowedResize;

      args.left.enabled = allowedResize;
      args.right.enabled = allowedResize;
      if (allowedResize) {
        args.left.html = moment(args.start.value).format('MMMM DD, YYYY hh:mm a');
        args.right.html = moment(args.end.value).format('MMMM DD, YYYY hh:mm a');
      }
    },
    onEventResize: args => {
      if (args.e.data.manualUpdate || args.e.data.projectStatus == "Done") {
        this.toastr.warning(args.e.data.projectStatus == "Done" ? "Booking completed! It can not be modified." : "Please switch off manual update for this event.")
        args.newStart = args.e.data.start;
        args.newEnd = args.e.data.end;
        return;
      }
      this.changeDate = false;
      let params = {
        id: args.e.id(),
        start: args.newStart,
        end: args.newEnd,
        startTime: moment(args.newStart.value).tz("Asia/Calcutta").format(),
        endTime: moment(args.newEnd.value).tz("Asia/Calcutta").format(),
        resource: args.e.data.resourceId,
        theme: args.e.data.theme,
        text: args.e.data.text,
        changeable: true,
        completion: args.e.data.completion,
        comment: args.e.data.comment
      };
      this.saveOrUpdateEvent([params]);
    }
  };

  constructor(private route: ActivatedRoute, private router: Router, public datepipe: DatePipe,
    private httpService: HttpService, private formBuilder: FormBuilder, private toastr: ToastrService, private dataService: DataService) {
  }

  ngAfterViewChecked(): void {
    // var y = document.getElementsByClassName("scheduler_default_corner");
    // if (y[0]) {
    //   y[0].children[3].setAttribute("style", "display:none !important;");
    // }
    // this.cdr.detectChanges();
  }

  ngOnDestroy() {
    if (this.scheduler && this.scheduler.config) {
      if (this.scheduler.config.contextMenu) {
        this.scheduler.config.contextMenu.hide();
      }
      if (this.scheduler.config.contextMenuSelection) {
        this.scheduler.config.contextMenuSelection.hide();
      }
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => this.projectId = params.id);
    if (this.projectId.toString() == "undefined" && !this.dataService.pathVariable) {
      this.router.navigate(["/teamium/project-list"]);
    }

    this.timeLineForm = this.formBuilder.group({
      date: [null],
      height: 50,
      format: 'Months/Days',
      eventName: [null],
      moveable: [false],
      resizable: [false],
      link: [false],
      selectMultiple: [false]
    });
    this.dataService.checkSubmenu(this.router);

    this.splitForm = this.formBuilder.group({
      splitNumber: [2, Validators.compose([Validators.required, Validators.min(2), Validators.pattern('^[0-9]+$')])],
    });

    this.timeLineForm.get('link').valueChanges.subscribe(value => {
      this.linkShow();
    });

    this.linkEventForm = this.formBuilder.group({
      eventName: [null, Validators.required]
    });

    this.timeLineForm.get('eventName').valueChanges.subscribe(el => {
      if (el && this.changeDate) {
        this.timeLineForm.get('date').setValue(new Date(el.start.value))
      }
    });

    this.timeLineForm.get('format').valueChanges.subscribe((value) => {
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
          ];
          this.config.scale = "Day";
          this.config.days = 365;
          this.config.cellWidth = 50;
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
          ];
          this.config.scale = "Day";
          let offset = new DayPilot.Date(this.config.startDate).daysInMonth()
          this.config.days = offset;
          this.config.cellWidth = 50;
          break;
        }
        case "Week/Days": {
          this.config.timeHeaders = [
            {
              "groupBy": "Month",
            },
            {
              "groupBy": "Day",
              "format": "dddd d"
            }
          ];
          this.config.scale = "Day";
          // let offset = new DayPilot.Date(this.config.startDate).dayOfWeek()
          this.config.days = 7;
          this.config.cellWidth = 190;
          break;
        }
        case "Week/Half Days": {
          this.config.timeHeaders = [
            {
              "groupBy": "Day",
              "format": "dddd, d MMMM yyyy"
            },
            {
              "groupBy": "Cell",
              "format": "hh tt"
            }
          ];
          this.config.scale = "CellDuration";
          this.config.cellDuration = 720;
          this.config.cellWidth = 100;
          this.config.days = 7;
          break;
        }
        case "Week/4 Hours": {
          this.config.timeHeaders = [
            {
              "groupBy": "Day",
              "format": "dddd, d MMMM yyyy"
            },
            {
              "groupBy": "Cell",
              "format": "hh tt"
            }
            // {
            //   "groupBy": "Hour"
            // }
          ];
          this.config.scale = "CellDuration";
          this.config.cellDuration = 60 * 4;
          this.config.cellWidth = 60;
          this.config.days = 7;
          break;
        }
        case "Week/Hours": {
          this.config.timeHeaders = [
            {
              "groupBy": "Day",
              "format": "dddd, d MMMM yyyy"
            },
            {
              "groupBy": "Hour"
            }
          ];
          this.config.scale = "Hour";
          this.config.cellWidth = 50;
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
          ];
          this.config.scale = "CellDuration";
          this.config.cellDuration = 30;
          this.config.cellWidth = 50;
          this.config.days = 1;
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
          this.config.cellWidth = 50;
          this.config.days = 1;
          break;
        }
      }
    });

    this.timeLineForm.get('height').valueChanges.subscribe((value) => {
      this.config.eventHeight = value;
    });

    this.timeLineForm.get('date').valueChanges.subscribe((value) => {
      // value.setDate(value.getDate() - 5);
      let change = this.datepipe.transform(value, 'yyyy-MM-dd');
      // let offset = new DayPilot.Date(change).daysInMonth()
      // this.config.days = offset + 30;
      this.config.startDate = change;
    });


    this.functionDropdowApi = this.httpService.callApi('getAllAvailableFunctions', {});
    this.getProjectResourcesApi = this.httpService.callApi('getProjectResources', { pathVariable: '/' + this.projectId });
    this.getProjectEventApi = this.httpService.callApi('getProjectsEvent', { pathVariable: '/' + this.projectId });
    let projectListApi = this.httpService.callApi('projectBasicInfo', {});
    let findBudgetIdFromProjectIdApi = this.httpService.callApi('findBudgetIdFromProjectId', { pathVariable: "/" + this.projectId });

    this.blockedPanel = true;
    forkJoin([this.getProjectResourcesApi, this.getProjectEventApi, this.functionDropdowApi, projectListApi, findBudgetIdFromProjectIdApi]).subscribe((responseList) => {
      if (responseList[0]) {
        this.setResource(responseList[0]);
      }
      if (responseList[1]) {
        this.setEvents(responseList[1], null);
      }
      if (responseList[2]) {
        this.functionDropdownData = responseList[2];
      }
      if (responseList[3]) {
        this.projectListInfo = responseList[3];
      }
      let pathVariable: any = new Array();
      if (responseList[4]) {
        pathVariable.push({ "budgetId": responseList[4] });
        let project = this.projectListInfo.find(el => el.id == this.projectId);
        this.projectName = project.title;
        if (project.status == 'Done') {
          this.config.eventResizeHandling = "Disabled";
          this.config.eventMoveHandling = "Disabled";
          this.config.contextMenu = new DayPilot.Menu({
            onShow: args => {

            },
            items: [
              {
                text: "View",
                icon: "fa fa-pencil-square-o",
                onClick: args => {
                  this.changeDate = false;
                  let project = this.projectListInfo.find(el => el.id == args.source.data.projectId);
                  let functions = this.functionDropdownData.find(element => element.function.id == args.source.data.functionId);
                  let functionName = functions.function;
                  let resource = functions.resources;
                  let test = {
                    projectList: this.projectListInfo,
                    data: args.source.data,
                    resources: resource,
                    functionName: functionName,
                    functionDropdown: this.functionDropdownData,
                    projectName: project.id ? project.id : null
                  }
                  this.editScheduled.show(test).subscribe(result => {
                    if (!result) {
                      return; // cancelled
                    }
                    this.saveBookingEvents(result);
                  });
                }
              },
              {
                text: "See Schedule",
                icon: "fa fa-search",
                onClick: args => {
                  this.goToSchedule(args.source.data);
                }
              }
            ],
          })
        } else {
          this.config.contextMenu = new DayPilot.Menu({
            onShow: args => {
              if (args.source.data.manualUpdate) {
                args.menu.items = [
                  {
                    text: "Edit",
                    icon: "fa fa-pencil-square-o",
                    onClick: args => {
                      this.changeDate = false;
                      let project = this.projectListInfo.find(el => el.id == args.source.data.projectId);
                      let functions = this.functionDropdownData.find(element => element.function.id == args.source.data.functionId);
                      let functionName = functions.function;
                      let resource = functions.resources;
                      let test = {
                        projectList: this.projectListInfo,
                        data: args.source.data,
                        resources: resource,
                        functionName: functionName,
                        functionDropdown: this.functionDropdownData,
                        projectName: project.id ? project.id : null
                      }
                      this.editScheduled.show(test).subscribe(result => {
                        if (!result) {
                          return; // cancelled
                        }
                        this.saveBookingEvents(result);
                      });
                    }
                  },
                  {
                    text: "See Schedule",
                    icon: "fa fa-search",
                    onClick: args => {
                      this.goToSchedule(args.source.data);
                    }
                  },
                  {
                    text: "Copy",
                    icon: 'fa fa-files-o',
                    onClick: args => {
                      let selected = this.scheduler.control.multiselect.events();
                      this.copyEvent = args.source.data;
                      // this.clipboard = selected.sort((e1, e2) => e1.start().getTime() - e2.start().getTime());
                    }
                  },
                  {
                    text: "Link",
                    icon: 'fa fa-link',
                    onClick: args => {
                      this.getAllLinkedEvents(args.source.data);
                    }
                  }
                ];
              } else {
                args.menu.items = [
                  {
                    text: "Edit",
                    icon: "fa fa-pencil-square-o",
                    onClick: args => {
                      this.changeDate = false;
                      let project = this.projectListInfo.find(el => el.id == args.source.data.projectId);
                      let functions = this.functionDropdownData.find(element => element.function.id == args.source.data.functionId);
                      let functionName = functions.function;
                      let resource = functions.resources;
                      let test = {
                        projectList: this.projectListInfo,
                        data: args.source.data,
                        resources: resource,
                        functionName: functionName,
                        functionDropdown: this.functionDropdownData,
                        projectName: project.id ? project.id : null
                      }
                      this.editScheduled.show(test).subscribe(result => {
                        if (!result) {
                          return; // cancelled
                        }
                        this.saveBookingEvents(result);
                      });
                    }
                  },
                  {
                    text: "See Schedule",
                    icon: "fa fa-search",
                    onClick: args => {
                      this.goToSchedule(args.source.data);
                    }
                  },
                  {
                    text: "Copy",
                    icon: 'fa fa-files-o',
                    onClick: args => {
                      let selected = this.scheduler.control.multiselect.events();
                      this.copyEvent = args.source.data;
                      // this.clipboard = selected.sort((e1, e2) => e1.start().getTime() - e2.start().getTime());
                    }
                  },
                  {
                    text: "Link",
                    icon: 'fa fa-link',
                    onClick: args => {
                      this.getAllLinkedEvents(args.source.data);
                    }
                  },
                  // {
                  //   text: "Unlink",
                  //   icon: 'fa fa-chain-broken',
                  //   onClick: args => {
                  //   }
                  // },
                  {
                    text: "Split",
                    icon: 'fa fa-files-o',
                    onClick: args => {
                      this.splitEventValue = args.source.data;
                    }
                  }
                ];
              }

            },
            items: [

            ],
          });
          this.config.contextMenuSelection = new DayPilot.Menu({
            onShow: args => {
              // let noItemsInClipboard = this.copyEvent ==null;
              // console.log('this.copyEven => ',this.copyEvent)
              args.menu.items[0].disabled = this.copyEvent == null;
            },
            items: [
              {
                text: "Paste",
                icon: 'fa fa-clipboard',
                onClick: args => {
                  console.log("args => ",args)
                  if (this.copyEvent == null) {
                    return;
                  }
                  this.changeDate = false;
                  let targetStart = args.source.start;
                  let targetResource = Number(args.source.resource.split("#")[1]);

                  let functionId=Number(args.source.resource.split("#")[0]);
                  // this.getFunctionByResourceId(targetResource, (functionIdValue) => {
                  //   functionId = functionIdValue;
                  // });

                  if (!functionId) {
                    this.toastr.warning("Paste event only on resource")
                    return;
                  }

                  let start = targetStart;
                  let end = start;

                  let params = {
                    cloneEventId: this.copyEvent.id,
                    start: start.value,
                    bookingId: this.copyEvent.bookingId,
                    end: end.value,
                    startTime: moment(start.value).tz("Asia/Calcutta").format(),
                    endTime: moment(end.value).tz("Asia/Calcutta").format(),
                    resource: targetResource,
                    text: this.copyEvent.text,
                    theme: this.copyEvent.theme,
                    completion: this.copyEvent.completion,
                    comment: this.copyEvent.comment,
                    functionId: functionId,
                    status: this.copyEvent.status
                  };
                  // console.log('Paste Params ', params)
                  this.saveCopyEvent(params);

                }
              }, {
                text: "New",
                icon: "fa fa-pencil-square-o",
                onClick: args => {
                  let functionId;
                  let resourceId=Number(args.source.resource.split("#")[1]);
                  this.getFunctionByResourceId(resourceId, (functionIdValue) => {
                    functionId = functionIdValue;
                  });
                  if (!functionId) {
                    this.toastr.warning("Create event only on resource")
                    return;
                  }
                  // console.log('functionId => ', functionId)
                  this.changeDate = true;
                  let test = {
                    projectList: this.projectListInfo,
                    data: args.source,
                    resource: resourceId,
                    functionId: functionId,
                    functionDropdown: this.functionDropdownData
                  }
                  this.createScheduled.show(test).subscribe(result => {
                    if (!result) {
                      return; // cancelled
                    }
                    this.saveBookingEvents(result);
                  });
                }
              }, {
                text: "Placeholder",
                icon: "fa fa-pencil-square-o",
                onClick: args => {

                }
              }
            ]
          });
        }
      }
      pathVariable.push({ "projectId": this.projectId });

      this.dataService.addPathvariables(pathVariable);
      this.blockedPanel = false;
    }, (error) => {
      this.scheduleNotAvailable = true;
      this.blockedPanel = false;
    });
  }

  getFunctionByResourceId(resourceId, cb) {
    let func = null;
    for (let element of this.functionDropdownData) {
      if (element.resources && !func) {
        if (element.resources.find(el => el.id == resourceId)) {
          func = element;
          break;
        }
      }
    }
    cb(func == null ? null : func.function.id);
  }
  setResource(resourceList) {
    // console.log("resourceList => ",resourceList)
    let resources = [];
    Object.keys(resourceList).forEach(function (key) {
      let availresource = [];
      let functionName;
      resourceList[key].forEach(element => {
        if (key == element.function.id) {
          functionName = element.function.qualifiedName;
        }
        let res = availresource.find(el => el.id ==  element.function.id+"#"+element.resource.id);
        if (!res) {
          availresource.push({ id: element.function.id+"#"+element.resource.id, name: '', name1: element.resource.name, function: element.function.qualifiedName });
        }
      });

      resources.push({
        id: "group_" + key,
        name: functionName,
        expanded: true,
        "children": availresource,
        eventHeight: 20
      }, )
    })
    // console.log("resources => ",resources)
    this.config.resources = resources;
  }
  setEvents(eventList, id) {
    this.events = eventList;
    this.events.forEach(element => {
      element.start = new DayPilot.Date(moment(element.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss"));
      element.end = new DayPilot.Date(moment(element.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss"));
      element.resourceId = element.resource;
      element.resource = element.functionId + "#" + element.resource;
      element.moveVDisabled = true;
      element.moveHDisabled = false;
    });
    let eventVaue = null;
    if (this.events.length > 0) {
      eventVaue = id ? this.events.find(el => el.id == id) : this.events.length == 1 ? this.events[0] : this.events.sort((el1, el2) => {
        if (el1.start > el2.start) {
          return 1;
        } else if (el1.start < el2.start) {
          return -1;
        }
        return 0;
      })[0];
    }
    this.timeLineForm.get('eventName').setValue(eventVaue);
    this.createlinkForEvent();
  }

  formatDuration(minutes: number): string {
    let result = Math.floor((minutes / (60 * 24))) + "d " + Math.floor((minutes % (60 * 24)) / 60) + "h " + Math.floor(minutes % 60) + "m";
    return result;
  }

  durationFromMinutes(minutes: number): DayPilot.Duration {
    return DayPilot.Duration.minutes(minutes);
  }

  goToSchedule(event: any) {
    let pathVariable: any = new Array();
    pathVariable.push(event);
    this.dataService.addPathvariables(pathVariable);
    this.dataService.openSubmenu('/teamium/schedule-timeline');
  }

  saveCopyEvent(params) {
    this.blockedPanel = true;
    this.httpService.callApi('copyEvent', { body: params }).subscribe((renponse) => {
      let apiList = [this.getProjectEventApi];
      forkJoin(apiList).subscribe((responseList) => {
        if (responseList[0]) {
          this.setEvents(responseList[0], renponse.id);
        }
        this.blockedPanel = false;
      }, (errorList) => {
        this.blockedPanel = false;
      })
    }, (error) => {
      this.blockedPanel = false;
    })
  }

  saveBookingEvents(params) {
    this.blockedPanel = true;
    this.httpService.callApi('saveBookingEvents', { body: params }).subscribe((renponse) => {
      let apiList = [this.getProjectEventApi, this.getProjectResourcesApi];
      forkJoin(apiList).subscribe((responseList) => {
        if (responseList[0]) {
          this.setEvents(responseList[0], renponse.id);
        }
        if (responseList[1]) {
          this.setResource(responseList[1]);
        }
        this.blockedPanel = false;
      }, (errorList) => {
        // console.log('Error in saveOrUpdateEvent => ', errorList)
        this.blockedPanel = false;
      })
    }, (error) => {
      this.blockedPanel = false;
    })
  }

  saveOrUpdateEvent(params) {
    this.blockedPanel = true;

    this.httpService.callApi('saveOrUpdateEvent', { body: params }).subscribe((renponse) => {

      let apiList = [this.getProjectEventApi];
      forkJoin(apiList).subscribe((responseList) => {
        if (responseList[0]) {
          this.setEvents(responseList[0], renponse.id);
        }
        this.blockedPanel = false;
      }, (errorList) => {
        renponse.forEach(res => {
          res.start = new DayPilot.Date(moment(res.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss"));
          res.end = new DayPilot.Date(moment(res.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss"));
          res.moveVDisabled = true;
          res.moveHDisabled = false;
          let index = this.events.findIndex(i => i.id == res.id);
          if (index > -1) {
            this.events.splice(index, 1);
            this.events.push(res);
          } else {
            this.events.push(res);
          }
          this.createlinkForEvent();
          this.toastr.success('Event Successfully Updated', 'Event');
        })
        this.blockedPanel = false;
      })
    }, (error) => {
      this.blockedPanel = false;
    })
  }

  getAllLinkedEvents(event, cb?) {
    this.blockedPanel = true;
    this.httpService.callApi('getAllLinkinedBookingEvents', { pathVariable: "/" + event.id }).subscribe((response) => {
      this.linkEventValue = event;

      this.linkEventValue.linkedEvents.forEach(element => {
        this.linkedEventsList.push({ id: element.id, text: element.text })
      });

      this.events.forEach(element => {
        let index = response.findIndex(el => el.id == element.id);
        if (index < 0) {
          this.linkingEventsList.push({ id: element.id, text: element.text });
        }
      });
      if (cb) {
        cb();
      } else {
        this.blockedPanel = false;
      }
    }, (error) => {
      this.blockedPanel = false;
    });
  }

  saveLinkEvents(event?) {
    let events;
    let list = JSON.parse(JSON.stringify(this.linkedEventsList));
    if (!event) {
      events = this.linkEventForm.get('eventName').value;
      if (!events) {
        return;
      }
      list.push({ id: events.id, text: events.text });
    } else {
      let index = list.findIndex(el => el.id == event.id);
      list.splice(index, 1);
    }
    this.blockedPanel = true;
    let body = {
      id: this.linkEventValue.id,
      linkedEvents: list
    }
    this.httpService.callApi('linkOrUnlinBookingEvents', { body }).subscribe((response) => {
      let apiList = [this.getProjectEventApi];
      forkJoin(apiList).subscribe((responseList) => {
        this.resetLinkForm();
        this.changeDate = false;
        this.getAllLinkedEvents(response, () => {
          if (responseList[0]) {
            this.setEvents(responseList[0], response.id);
          }
          this.blockedPanel = false;
          this.toastr.success('Event Successfully Linked', 'Event Link');
        });
      }, (errorList) => {
        this.blockedPanel = false;
      })

    }, (error) => {
      // console.log('error ', error)
      this.toastr.error(error.error.message, 'Event Link');
      this.linkedEventsList = [];
      this.linkEventValue.linkedEvents.forEach(element => {
        this.linkedEventsList.push({ id: element.id, text: element.text })
      });
      this.linkingEventsList = [];
      this.events.forEach(element => {
        if (element.id != this.linkEventValue.id) {
          let index = this.linkedEventsList.findIndex(el => el.id == element.id);
          if (index < 0) {
            this.linkingEventsList.push({ id: element.id, text: element.text });
          }
        }
      });

      this.blockedPanel = false;
    })
  }

  closeLinkSplit() {
    this.linkEventValue = null;
    this.resetLinkForm();
  }

  resetLinkForm() {
    this.linkEventForm.reset();
    this.linkingEventsList = [];
    this.linkedEventsList = [];
  }

  link = [];

  createlinkForEvent() {
    this.link = [];
    this.events.forEach(response => {
      response.linkedEvents.forEach(element => {
        this.link.push({
          from: response.id,
          to: element.id,
          type: "FinishToStart",
          color: "blue",
          // style: "dotted",
          width: 3
        });
      });
    });
    this.linkShow();
  }

  linkShow() {
    if (this.timeLineForm.get('link').value) {
      this.config.links = JSON.parse(JSON.stringify(this.link));
    } else {
      this.config.links = [];
    }
  }

  print() {
    this.scheduler.control.exportAs("svg").print();
  }

  @HostListener('document:click', ['$event.target'])
  onClickedOutside(targetElement) {
    if (!targetElement.closest('#option-id') && this.openOpion) {
      this.openOpion = false;
    }
  }

  splitEvents() {
    this.blockedPanel = true;
    this.splitEvent(this.splitEventValue, (events) => {
      this.splitEventApi(events, () => {
        this.closeSplit();
        this.blockedPanel = false;
      })
    });
  }

  splitEventApi(params, cb) {
    this.changeDate = false;
    this.httpService.callApi('splitEvent', { body: params }).subscribe((resp) => {
      let apiList = [this.getProjectEventApi];
      forkJoin(apiList).subscribe((responseList) => {
        if (responseList[0]) {
          this.setEvents(responseList[0], resp.id);
        }
        cb();
        this.toastr.success('Event Successfully Updated', 'Event');
      }, (errorList) => {
        cb();
      })
    }, (error) => {
      cb();
      this.toastr.success('Event', error.error.message);
    })
  }
  closeSplit() {
    this.splitEventValue = null;
    this.splitForm.reset({
      splitNumber: 2
    });
  }
  splitEvent(data, cb) {
    var e = data;
    let totalMinutes = new DayPilot.Duration(e.start, e.end).totalMinutes();
    let splitSize = this.splitForm.get('splitNumber').value;
    let quotient = Math.floor(totalMinutes / splitSize);
    // console.log('quotient ', quotient)
    if (quotient < 1 || splitSize == 1) {
      return;
    }
    let remainder = totalMinutes % splitSize;

    let startTime = new DayPilot.Date(e.start);
    let elements = [];

    for (let i = 0; i < splitSize; i++) {
      let start = startTime.addMinutes(i * quotient);
      let end = startTime.addMinutes((i + 1) * quotient + ((i != splitSize - 1) ? 0 : remainder));
      elements.push({
        id: i == 0 ? e.id : null,
        start: start,
        end: end,
        resource: e.resourceId,
        bookingId: e.bookingId,
        theme: e.theme,
        text: e.text,
        startTime: moment(start['value']).tz("Asia/Calcutta").format(),
        endTime: moment(end['value']).tz("Asia/Calcutta").format(),
        duration: 120,
        completion: e.completion,
        comment: e.comment,
        changeable: true,
        status: e.status
      })
      if (i == splitSize - 1) {
        cb(elements);
      }
    }
  }

  getStatusCode(status, isCompletion?) {
    switch (status) {
      case 'Requested': {
        if (isCompletion) {
          return '#c3c3c3';
        } else {
          return 'green';
        }
      }
      case 'Awaiting Confirmation': {
        if (isCompletion) {
          return '#c3c3c3';
        } else {
          return 'orange';
        }
      }
      case 'Penciled': {
        if (isCompletion) {
          return '#c3c3c3';
        } else {
          return 'grey';
        }
      }
      case 'On Hold': {
        if (isCompletion) {
          return '#c3c3c3';
        } else {
          return 'red';
        }
      }
      case 'Confirmed': {
        if (isCompletion) {
          return '#c3c3c3';
        } else {
          return '#2f6f98';
        }
      }
    }
  }
  hexToR(h) { return parseInt((this.cutHex(h)).substring(0, 2), 16) }
  hexToG(h) { return parseInt((this.cutHex(h)).substring(2, 4), 16) }
  hexToB(h) { return parseInt((this.cutHex(h)).substring(4, 6), 16) }
  cutHex(h) { return (h.charAt(0) == "#") ? h.substring(1, 7) : h }
}

