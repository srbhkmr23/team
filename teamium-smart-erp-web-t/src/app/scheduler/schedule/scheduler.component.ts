import { Component, ViewChild, ComponentFactoryResolver, Injector, ApplicationRef, OnInit, HostListener, SystemJsNgModuleLoader, ChangeDetectorRef, AfterViewChecked, OnDestroy } from "@angular/core";
import { DayPilot, DayPilotSchedulerComponent } from "daypilot-pro-angular";
import { TaskScheduledEditComponent } from "../taskscheduled/task-scheduled-edit.component";
import { DatePipe } from '@angular/common'
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "../../core/services/http.service";
import { ToastrService } from "ngx-toastr";
import { CreateeventComponent } from "../create-event/createevent.component";
import * as moment from 'moment-timezone';
import { DataService } from "../../core/services/data.service";
import { forkJoin } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: 'scheduler-component',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit, OnDestroy {


  @ViewChild("scheduler") scheduler: DayPilotSchedulerComponent;
  @ViewChild("editScheduled") editScheduled: TaskScheduledEditComponent;
  @ViewChild("createScheduled") createScheduled: CreateeventComponent;

  unscheduled: any[] = [];
  events: any[] = [];
  // autoCopy: boolean;
  clipboard: DayPilot.Event[] = [];
  multipleSelect: any = [];
  openOpion: boolean = false;
  eventId: number = -1;
  changeDate: boolean = true;
  projectListInfo: any;
  isClick: any;
  searchText: any;
  copyEvent: any = null;

  config: any = {
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
      }],


    scale: "Day",
    cellDuration: 15,

    rowHeaderColumns: [
      { name: 'Name' }
    ],
    locale: "en-us",
    days: DayPilot.Date.today().daysInMonth(),
    businessWeekends: false,
    startDate: '2018-09-01',
    showNonBusiness: true,
    businessBeginsHour: 0,
    businessEndsHour: 24,
    allowMultiSelect: true,
    eventClickHandling: "Select",
    eventDoubleClickHandling: "Enabled",
    bubble: new DayPilot.Bubble({
      cssOnly: true,
      cssClassPrefix: "bubble_default",
      onLoad: args => {
        let html;
        let string = args.source.data.collapse ? '../../assets/img/alert-icon.png' : null;
        if (string) {
          html = "<img src='" + string + "' class='alertImageIcon' style='position: absolute; top:6px;left:2px;  width: 20px !important; height: 20px;' alt=''>"
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
      // console.log('Event args ',args.data)
      // args.data.barHidden = true;
      args.data.cssClass = args.data.selected ? "myclass" : "";
      args.data.complete = args.data.completion;
      if (args.data.selected) {
        args.data.backColor = "#59c3ea";
      } else {
        // let color = !args.data.theme?"black":"rgba(" + this.hexToR(args.data.theme) + ", " + this.hexToG(args.data.theme) + ", " + this.hexToB(args.data.theme) + ",0.5)";
        args.data.backColor = args.data.theme;
      }
      // args.data.backColor = args.data.selected ? "#59c3ea" : args.data.theme;
      let html;
      let string = args.data.collapse ? '../../assets/img/alert-icon.png' : null;
      if (string) {
        html = "<img src='" + string + "' class='alertImageIcon' alt=''>"
      }
      // let element = this.multipleSelect.find(el => el.id == args.data.id);
      // console.log('element => ', element)
      // args.data.html = html ? html + "<div class='test' style='padding: 5px 0px 0px 25px;color: #fff;'><span>" + args.data.text + "</span><br><span class='task-duration'>" + this.formatDuration(new DayPilot.Duration(args.data.start, args.data.end).totalMinutes()) + "</span><br><span> (" + moment(args.data.start.value).format('hh:mm a').toUpperCase() + " - " + moment(args.data.end.value).format('hh:mm a').toUpperCase() + ")" + "</span></div>" : "<div  class='test' style='padding: 5px 0px 0px 3px;color: #fff;'><span>" + args.data.text + "</span><br><span class='task-duration'>" + this.formatDuration(new DayPilot.Duration(args.data.start, args.data.end).totalMinutes()) + " </span><br><span>(" + moment(args.data.start.value).format('hh:mm a').toUpperCase() + " - " + moment(args.data.end.value).format('hh:mm a').toUpperCase() + ")" + "</span></div>";
      let string1 = "<div  class=" + (args.data.selected ? "'test selected'" : "'test'") + " style='color: #fff;'><span>" + args.data.text + "</span></div>";
      args.data.html = html ? html + string1 : string1;
      // console.log(' this.link ', this.link)
      // console.log(' this.linkEventIDList ', this.linkEventIDList)
      let el = this.linkEventIDList.find(el => el == args.data.id);

      let iconsList: any = [];
      if (el) {
        iconsList.push({ bottom: 9, left: string ? 38 : 8, icon: "fa fa-link", style: args.data.selected ? "font-size: 15px;color:#333" : "font-size: 15px;color:#fff" });
      }
      // if (args.data.selected) {
      //   // iconsList.push({ bottom: 0, right: 6, icon: "fa fa-check", style: "font-size: 20px;color:#66ff33" });
      // }
      args.data.areas = iconsList;
      // }
      // console.log('data => ',args.data)
      args.data.barColor = args.data.status ? this.getStatusCode(args.data.status) : args.data.theme;
      args.data.barBackColor = args.data.status ? this.getStatusCode(args.data.status, true) : args.data.theme;
      // args.data.barBackColor = args.data.status ? args.data.status : args.data.theme;



      // // if (args.data.selected) {
      // var y = document.getElementsByClassName("scheduler_default_event");
      // // console.log(y[0])
      // // if( y['offsetParent'][0])
      // if (y[0]) {
      //   console.log('inside y => ', y[0])
      //   y[0].setAttribute("class", "blueClass");
      // }

      // }
    }, onBeforeEventExport: args => {
      let ts = args.e.data.text.toString().replace("\n", "");
      args.text = ts + "\n" + this.formatDuration(new DayPilot.Duration(args.e.data.start, args.e.data.end).totalMinutes()) + "\n" + " (" + moment(args.e.data.start.value).format('hh:mm a') + " - " + moment(args.e.data.end.value).format('hh:mm a') + ")";
      args.fontStyle = "bold";
      args.fontColor = "#fff";
      args.e.barColor = "red";
      args.e.barBackColor = "green";
      // args.barColor = "red";
      // args.barBackColor = "green";
    },
    onEventSelected: args => {
      // if (this.autoCopy) {
      //   this.clipboard = this.scheduler.control.multiselect.events();
      // }

    }, onEventDoubleClick: args => {
      this.changeDate = false;
      let project = this.projectListInfo.find(el => el.id == args.e.data.projectId);
      let functions = this.functionDropDown.find(element => element.function.id == args.e.data.functionId);
      let functionName = functions.function;
      let resource = functions.resources;
      let test = {
        projectList: this.projectListInfo,
        data: args.e.data,
        resources: resource,
        functionName: functionName,
        functionDropdown: this.functionDropDown,
        projectName: project.id ? project.id : null
      }
      this.editScheduled.show(test).subscribe(result => {
        // console.log(' resultUpdate ', result)
        if (!result) {
          return; // cancelled
        }
        this.saveBookingEvents(result);
      });
    },
    onEventClick: args => {
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
      if (args.external) {
        return;
      }

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
      if (!args.external && args.e.data.projectStatus == "Done") {
        this.toastr.warning(args.e.data.projectStatus == "Done" ? "Booking is in Done state." : "Please switch off manual update.")
        args.newStart = args.e.data.start;
        args.newEnd = args.e.data.end;
        args.newResource = args.e.data.resource;
        return;
      }
      this.changeDate = false;
      let params = {
        id: args.e.id(),
        start: args.newStart,
        end: args.newEnd,
        resource: args.newResource,
        theme: args.e.data.theme,
        text: args.e.data.text,
        startTime: moment(args.newStart.value).tz("Asia/Calcutta").format(),
        endTime: moment(args.newEnd.value).tz("Asia/Calcutta").format(),
        changeable: args.external ? false : true,
        moveLinkedEvent: true,
        completion: args.e.data.completion,
        comment: args.e.data.comment
      };
      this.saveOrUpdateEvent([params], () => {
        if (args.external) {
          let i = this.unscheduled.findIndex(i => i.id === args.e.id());
          if (i > -1) {
            this.unscheduled.splice(i, 1);
          }
        }
        this.blockedPanel = false;
      });
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
      // console.log('onEventResize')
      if (args.e.data.manualUpdate || args.e.data.projectStatus == "Done") {
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
        startTime: moment(args.newStart.value).tz("Asia/Calcutta").format(),
        endTime: moment(args.newEnd.value).tz("Asia/Calcutta").format(),
        resource: args.e.resource(),
        theme: args.e.data.theme,
        text: args.e.data.text,
        changeable: true,
        completion: args.e.data.completion,
        comment: args.e.data.comment
      };
      this.saveOrUpdateEvent([params]);
    },

    contextMenu: new DayPilot.Menu({
      onShow: args => {
        if (!this.scheduler.control.multiselect.isSelected(args.source)) {
          this.scheduler.control.multiselect.clear();
          this.scheduler.control.multiselect.add(args.source);
        }
        if (args.source.data.projectStatus == 'Done') {
          args.menu.items = [
            {
              text: "View",
              icon: "fa fa-pencil-square-o",
              onClick: args => {

                this.changeDate = false;
                let project = this.projectListInfo.find(el => el.id == args.source.data.projectId);
                let functions = this.functionDropDown.find(element => element.function.id == args.source.data.functionId);
                let functionName = functions.function;
                let resource = functions.resources;
                let test = {
                  projectList: this.projectListInfo,
                  data: args.source.data,
                  resources: resource,
                  functionName: functionName,
                  functionDropdown: this.functionDropDown,
                  projectName: project.id ? project.id : null
                }
                this.editScheduled.show(test).subscribe(result => {
                  // console.log(' resultUpdate ', result)
                  if (!result) {
                    return; // cancelled
                  }
                  this.saveBookingEvents(result);
                });
              }
            },
            {
              text: "See Project",
              icon: "fa fa-search",
              onClick: args => {
                this.goToProject(args.source.data.projectId);
              }
            }
          ];
        } else if (args.source.data.manualUpdate) {
          args.menu.items = [
            {
              text: "Edit",
              icon: "fa fa-pencil-square-o",
              onClick: args => {
                this.changeDate = false;
                let project = this.projectListInfo.find(el => el.id == args.source.data.projectId);
                let functions = this.functionDropDown.find(element => element.function.id == args.source.data.functionId);
                let functionName = functions.function;
                let resource = functions.resources;
                let test = {
                  projectList: this.projectListInfo,
                  data: args.source.data,
                  resources: resource,
                  functionName: functionName,
                  functionDropdown: this.functionDropDown,
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
              text: "See Project",
              icon: "fa fa-search",
              onClick: args => {
                this.goToProject(args.source.data.projectId);
              }
            },
            {
              text: "Unschedule",
              icon: 'fa fa-times',
              onClick: args => {
                var e = args.source;
                let params = {
                  id: e.data.id,
                  text: e.data.text,
                  start: e.data.start,
                  end: e.data.end,
                  startTime: moment(e.data.start).tz("Asia/Calcutta").format(),
                  endTime: moment(e.data.start).tz("Asia/Calcutta").format(),
                  theme: e.data.theme,
                  resource: this.defaultId,
                  changable: false
                }
                this.unscheduleTask(params);
              }
            },
            // {
            //   text: "Link",
            //   icon: 'fa fa-link',
            //   onClick: args => {
            //     this.getAllLinkedEvents(args.source.data);
            //   }
            // },
            {
              text: "Copy",
              icon: 'fa fa-files-o',
              onClick: args => {
                let selected = this.scheduler.control.multiselect.events();
                this.copyEvent = args.source.data;
                // let selected = this.scheduler.control.multiselect.events();
                this.clipboard = selected.sort((e1, e2) => e1.start().getTime() - e2.start().getTime());
              }
            },
            {
              text: "Empty Selection",
              onClick: args => {
                this.multipleSelect = [];
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
                let functions = this.functionDropDown.find(element => element.function.id == args.source.data.functionId);
                let functionName = functions.function;
                let resource = functions.resources;
                let test = {
                  projectList: this.projectListInfo,
                  data: args.source.data,
                  resources: resource,
                  functionName: functionName,
                  functionDropdown: this.functionDropDown,
                  projectName: project.id ? project.id : null
                }
                this.editScheduled.show(test).subscribe(result => {
                  // console.log(' resultUpdate ', result)
                  if (!result) {
                    return; // cancelled
                  }
                  this.saveBookingEvents(result);
                });
              }
            },
            {
              text: "See Project",
              icon: "fa fa-search",
              onClick: args => {
                this.goToProject(args.source.data.projectId);
              }
            },

            {
              text: "Unschedule",
              icon: 'fa fa-times',
              onClick: args => {
                var e = args.source;
                // console.log("Unschedule", e)
                let params = {
                  id: e.data.id,
                  text: e.data.text,
                  start: e.data.start,
                  end: e.data.end,
                  startTime: moment(e.data.start).tz("Asia/Calcutta").format(),
                  endTime: moment(e.data.start).tz("Asia/Calcutta").format(),
                  theme: e.data.theme,
                  resource: this.defaultId,
                  changable: false
                }
                this.unscheduleTask(params);
              }
            },
            {
              text: "Split",
              icon: 'fa fa-files-o',
              onClick: args => {
                this.splitEventValue = args.source.data;
              }
            },
            // {
            //   text: "Link",
            //   icon: 'fa fa-link',
            //   onClick: args => {
            //     this.getAllLinkedEvents(args.source.data);
            //   }
            // },
            {
              text: "Copy",
              icon: 'fa fa-files-o',
              onClick: args => {
                let selected = this.scheduler.control.multiselect.events();
                this.copyEvent = args.source.data;
                // let selected = this.scheduler.control.multiselect.events();
                this.clipboard = selected.sort((e1, e2) => e1.start().getTime() - e2.start().getTime());
              }
            },
            {
              text: "Empty Selection",
              onClick: args => {
                this.multipleSelect = [];
              }
            }
          ];
        }
      },
      items: [
      ],
    }),

    contextMenuSelection: new DayPilot.Menu({
      onShow: args => {
        // let noItemsInClipboard = this.clipboard.length === 0;
        // args.menu.items[0].disabled = noItemsInClipboard;
        args.menu.items[0].disabled = this.copyEvent == null;
      },
      items: [
        {
          text: "Paste",
          icon: 'fa fa-clipboard',
          onClick: args => {
            if (this.copyEvent == null) {
              return;
            }
            this.changeDate = false;
            let targetStart = args.source.start;
            let targetResource = args.source.resource;

            let functionId;
            this.getFunctionByResourceId(targetResource, (functionIdValue) => {
              functionId = functionIdValue;
            });

            if (!functionId) {
              this.toastr.error("Paste event only on resource")
              return;
            }
            this.scheduler.control.clearSelection();

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
            this.saveCopyEvent(params);

          }
        }, {
          text: "New",
          icon: "fa fa-pencil-square-o",
          onClick: args => {

            this.changeDate = true;
            let test = {
              projectList: this.projectListInfo,
              data: args.source,
              resource: args.source.resource,
              functionId: this.timeLineForm.get("functionName").value.function.id,
              functionDropdown: this.functionDropDown
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
            // let test = {
            //   resources: this.config.resources,
            //   functionName: this.timeLineForm.get("functionName").value.function.qualifiedName
            // }

            // this.createScheduled.show(test).subscribe(result => {
            //   if (!result) {
            //     return; // cancelled
            //   }
            //   this.saveOrUpdateEvent([result]);
            // });

          }
        }
      ]
    }),

  };


  value: Date;
  timeLineForm: FormGroup;
  splitForm: FormGroup;
  linkEventForm: FormGroup;
  functionDropDown: any;
  blockedPanel: boolean;
  heights: any = [50, 70, 100];
  formats: any = ['Years/Months/Days', 'Months/Days', 'Week/Days', 'Week/Half Days', 'Week/4 Hours', 'Week/Hours', 'Days/Hours/30Min', 'Days/Hours/15Min'];
  defaultId: number = 0;
  splitEventValue: any;
  linkEventValue: any;
  linkedEventsList: any = [];
  linkingEventsList: any = [];
  linkEventIdApi: any;
  linkEventIDList: any = [];

  constructor(private router: Router, private cdr: ChangeDetectorRef, public datepipe: DatePipe, private httpService: HttpService, private formBuilder: FormBuilder, private toastr: ToastrService, private dataService: DataService) {

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
    this.isClick = false;
    this.blockedPanel = true;
    this.dataService.checkSubmenu(this.router);
    this.timeLineForm = this.formBuilder.group({
      date: [null],
      functionName: [null],
      eventName: [null],
      height: 40,
      format: 'Months/Days',
      moveable: [false],
      resizable: [false],
      link: [false],
      selectMultiple: [false]
    });

    this.dataService.dropDownValueChange.subscribe(value => {

      let functionValue = this.timeLineForm.get('functionName').value;

      if (value && value.function) {
        if (!functionValue || functionValue.function.id != value.function.id) {
          this.timeLineForm.get('functionName').setValue(value);
        }
      } else {
        this.timeLineForm.get('functionName').setValue(null);
        this.config.resources = [];
        this.events = [];
        this.unscheduled = [];
        // this.cdr.detectChanges();
      }
    });
    this.timeLineForm.get('link').valueChanges.subscribe(value => {
      this.linkShow();
    });

    this.timeLineForm.get('eventName').valueChanges.subscribe(el => {
      if (el && this.changeDate) {
        this.timeLineForm.get('date').setValue(new Date(el.start.value))
      }
    })

    this.splitForm = this.formBuilder.group({
      splitNumber: [2, Validators.compose([Validators.required, Validators.min(2), Validators.pattern('^[0-9]+$')])],
    });

    this.linkEventForm = this.formBuilder.group({
      eventName: [null, Validators.required]
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

    let projectListApi = this.httpService.callApi('projectBasicInfo', {});
    let functionListApi = this.httpService.callApi('getAllAvailableFunctions', {});
    this.linkEventIdApi = this.httpService.callApi('getAllLinkEventID', {});

    forkJoin([functionListApi, projectListApi, this.linkEventIdApi]).subscribe((responseList) => {
      if (responseList[0]) {
        this.functionDropDown = responseList[0];
        let functionName;
        if (this.functionDropDown.length > 0) {
          if (this.dataService.pathVariable && this.dataService.pathVariable[0] && this.dataService.pathVariable[0].start) {
            let index = this.functionDropDown.findIndex(el => el.function.id == this.dataService.pathVariable[0].functionId);
            functionName = this.functionDropDown[index];
          } else {
            functionName = this.functionDropDown[0];
          }
          this.timeLineForm.get('functionName').setValue(functionName);
        }
      }
      if (responseList[1]) {
        this.projectListInfo = responseList[1];
      }
      if (responseList[2]) {
        this.linkEventIDList = responseList[2];
        // console.log('this.linkEventIDList => ', this.linkEventIDList)
      }

      this.blockedPanel = false;
    }, (error) => {
      this.blockedPanel = false;
    });


    this.timeLineForm.get('functionName').valueChanges.subscribe((value) => {
      // console.log('enter value ', value)

      if (value) {
        this.blockedPanel = true;
        // this.cdr.detectChanges();
        this.multipleSelect = [];

        this.defaultId = value.defaultResource == null ? 0 : value.defaultResource.id;

        let res = [];
        if (value.resources) {
          value.resources.filter(i => i.id != this.defaultId).forEach(element => {
            res.push({ "id": element.id, "name": element.name })
          });
        }

        this.config.resources = res;

        this.httpService.callApi('getAllEvents', { pathVariable: "/" + value.function.id }).subscribe((responce) => {

          this.events = responce.filter(i => i.resource != this.defaultId);
          this.events.forEach(element => {

            element.start = new DayPilot.Date(moment(element.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss"));
            element.end = new DayPilot.Date(moment(element.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss"));
          })
          let res = responce.filter(i => i.resource == this.defaultId)[0];
          this.unscheduled = responce.filter(i => i.resource == this.defaultId).map(i => {

            i.start = new DayPilot.Date(moment(i.startTime).tz("Asia/Calcutta").format());
            i.end = new DayPilot.Date(moment(i.endTime).tz("Asia/Calcutta").format());
            let duration = new DayPilot.Duration(i.start, i.end);

            return {
              id: i.id,
              start: i.start,
              end: i.end,
              text: i.text,
              duration: duration.totalMinutes(),
              theme: i.theme
            };
          });

          let eventVaue = null;
          if (this.dataService.pathVariable && this.dataService.pathVariable[0] && this.dataService.pathVariable[0].start) {
            eventVaue = this.events.find(el => el.id == this.dataService.pathVariable[0].id);
            if (!eventVaue) {
              this.timeLineForm.get('date').setValue(new Date(this.dataService.pathVariable[0].start))
            }
            this.dataService.addPathvariables(null);
          } else if (this.events.length > 0) {
            eventVaue = this.eventId > -1 ? this.events.find(el => el.id == this.eventId) : this.events[0];
          }
          this.timeLineForm.get('eventName').setValue(eventVaue);

          this.createlinkForEvent();
          this.blockedPanel = false;
          // this.cdr.detectChanges();
        },
          (error) => {
            this.blockedPanel = false;
            // this.cdr.detectChanges();
            // console.log('error ', error)
          });
      }

    });

    this.timeLineForm.get('date').valueChanges.subscribe((value) => {
      // value.setDate(value.getDate() - 5);
      let change = this.datepipe.transform(value, 'yyyy-MM-dd');
      // let offset = new DayPilot.Date(change).daysInMonth()
      // this.config.days = offset + 364;
      this.config.startDate = change;
    });
  }

  saveOrUpdateEvent(params, cb?: any) {
    this.blockedPanel = true;
    this.httpService.callApi('saveOrUpdateEvent', { body: params }).subscribe((resp) => {
      let eventApi = this.httpService.callApi('getAllEvents', { pathVariable: "/" + this.timeLineForm.get('functionName').value.function.id });
      forkJoin([eventApi]).subscribe((responceList) => {
        this.setEvents(responceList[0], resp.id)
        // this.linkEventIDList = responceList[1];
        // console.log("  this.linkEventIDList => ", this.linkEventIDList)
        if (cb) {
          cb();
        } else {
          this.blockedPanel = false;
        }
        this.toastr.success('Event Successfully Updated', 'Event');
      }, (errorList) => {
        this.blockedPanel = false;
      });
    }, (error) => {
      this.blockedPanel = false;
    })
  }

  setEvents(response, id) {
    this.events = response.filter(i => i.resource != this.defaultId);
    this.events.forEach(element => {
      element.start = new DayPilot.Date(moment(element.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss"));
      element.end = new DayPilot.Date(moment(element.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss"));
    })

    let eventVaue = null;
    if (this.events.length > 0) {
      eventVaue = id ? this.events.find(el => el.id == id) : this.events[0];
    }

    this.timeLineForm.get('eventName').setValue(eventVaue);
    this.createlinkForEvent();
  }
  saveBookingEvents(params) {
    if (params.recurrence) {
      this.saveRecurrenceEvent(params);
    } else {
      this.blockedPanel = true;
      this.httpService.callApi('saveBookingEvents', { body: params }).subscribe((renponse) => {
        let apiList = [this.httpService.callApi('getAllEvents', { pathVariable: "/" + this.timeLineForm.get('functionName').value.function.id }), this.linkEventIdApi];
        forkJoin(apiList).subscribe((responseList) => {
          if (responseList[0]) {
            this.setEvents(responseList[0], renponse.id);
            this.unscheduled = responseList[0].filter(i => i.resource == this.defaultId).map(i => {

              i.start = new DayPilot.Date(moment(i.startTime).tz("Asia/Calcutta").format());
              i.end = new DayPilot.Date(moment(i.endTime).tz("Asia/Calcutta").format());
              let duration = new DayPilot.Duration(i.start, i.end);
              return {
                id: i.id,
                start: i.start,
                end: i.end,
                text: i.text,
                duration: duration.totalMinutes(),
                theme: i.theme
              };
            });
          }
          this.linkEventIDList = responseList[1];
          this.blockedPanel = false;
        }, (errorList) => {
          // console.log('Error in saveOrUpdateEvent => ', errorList)
          this.blockedPanel = false;
        })
      }, (error) => {
        this.blockedPanel = false;
      })
    }

  }
  saveCopyEvent(params) {
    this.blockedPanel = true;
    this.httpService.callApi('copyEvent', { body: params }).subscribe((renponse) => {
      let apiList = [this.httpService.callApi('getAllEvents', { pathVariable: "/" + this.timeLineForm.get('functionName').value.function.id })];
      forkJoin(apiList).subscribe((responseList) => {
        if (responseList[0]) {
          this.setEvents(responseList[0], renponse.id);
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

  unscheduleTask(params: any): void {
    this.blockedPanel = true;
    this.httpService.callApi('saveOrUpdateEvent', { body: [params] }).subscribe((renponse) => {
      renponse.forEach(res => {
        this.httpService.callApi('getAllEvents', { pathVariable: "/" + this.timeLineForm.get('functionName').value.function.id }).subscribe((responce) => {
          this.events = responce.filter(i => i.resource != this.defaultId);
          this.events.forEach(element => {
            element.start = new DayPilot.Date(moment(element.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss"));
            element.end = new DayPilot.Date(moment(element.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss"));
          })
          // console.log('  this.events  ', this.events)

        });
        res.start = new DayPilot.Date(moment(res.startTime).tz("Asia/Calcutta").format());
        res.end = new DayPilot.Date(moment(res.endTime).tz("Asia/Calcutta").format());

        let duration = new DayPilot.Duration(res.start, res.end);

        let responce = {
          id: res.id,
          start: res.start,
          end: res.end,
          text: res.text,
          duration: duration.totalMinutes(),
          theme: res.theme
        };
        this.unscheduled.push(responce);
        // console.log(' this.unscheduled ', this.unscheduled)
      })
      this.toastr.success('Event Successfully Updated', 'Event');
      this.blockedPanel = false;
    }, (error) => {
      this.blockedPanel = false;
    })

  }

  formatDuration(minutes: number): string {
    let result = Math.floor((minutes / (60 * 24))) + "d " + Math.floor((minutes % (60 * 24)) / 60) + "h " + Math.floor(minutes % 60) + "m";
    return result;
  }

  durationFromMinutes(minutes: number): DayPilot.Duration {
    return DayPilot.Duration.minutes(minutes);
  }
  copiedEvent = null;

  changeEvent(item) {
    this.copiedEvent = item;
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
      this.httpService.callApi('getAllEvents', { pathVariable: "/" + this.timeLineForm.get('functionName').value.function.id }).subscribe((response) => {
        this.setEvents(response, resp.id)

        cb();
        this.toastr.success('Event Successfully Updated', 'Event');
        // console.log('  this.events  ', this.events)
      }, (error) => {
        cb();
        this.toastr.success('Event', error.error.message);
      });
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
        resource: e.resource,
        bookingId: e.bookingId,
        theme: e.theme,
        text: e.text,
        completion: e.completion,
        comment: e.comment,
        startTime: moment(start['value']).tz("Asia/Calcutta").format(),
        endTime: moment(end['value']).tz("Asia/Calcutta").format(),
        duration: 120,
        changeable: true,
        status: e.status
      })
      if (i == splitSize - 1) {
        cb(elements);
      }
    }
  }

  goToProject(projectId: any) {
    // console.log('projectId ', projectId)
    let pathVariable: any = new Array();
    pathVariable.push(projectId);
    this.dataService.addPathvariables(pathVariable);
    this.dataService.openSubmenu('/teamium/project-booking/' + projectId);
  }

  @HostListener('document:click', ['$event.target'])
  onClickedOutside(targetElement) {
    if (!targetElement.closest('#option-id') && this.openOpion) {
      this.openOpion = false;
    }
  }

  getAllLinkedEvents(event, cb?) {
    this.blockedPanel = true;
    let getAllLinkingEventApi = this.httpService.callApi('getAllLinkinedBookingEvents', { pathVariable: "/" + event.id });
    let getProjectEventApi = this.httpService.callApi('getProjectsEvent', { pathVariable: '/' + event.projectId });

    forkJoin(getAllLinkingEventApi, getProjectEventApi).subscribe((responceList) => {

      this.linkEventValue = event;
      this.linkEventValue.linkedEvents.forEach(element => {
        this.linkedEventsList.push({ id: element.id, text: element.text })
      });
      responceList[1].forEach(element => {
        if (element.functionId == event.functionId) {
          let index = responceList[0].findIndex(el => el.id == element.id);
          if (index < 0) {
            this.linkingEventsList.push({ id: element.id, text: element.text });
          }
        }
      });
      if (cb) {
        cb();
      } else {
        this.blockedPanel = false;
      }
    }, (errorList) => {
      this.blockedPanel = false;
    });
  }

  saveLinkEvents(event?) {
    this.blockedPanel = true;
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
    let body = {
      id: this.linkEventValue.id,
      linkedEvents: list
    }
    this.httpService.callApi('linkOrUnlinBookingEvents', { body }).subscribe((response) => {

      // console.log('response ', response)
      // console.log(' b4 Previous ', this.config.links);
      this.changeDate = false;

      let apiList = [this.httpService.callApi('getAllEvents', { pathVariable: "/" + this.timeLineForm.get('functionName').value.function.id }), this.linkEventIdApi];
      forkJoin(apiList).subscribe((responseList) => {
        this.resetLinkForm();
        this.getAllLinkedEvents(response, () => {
          if (responseList[0]) {
            this.setEvents(responseList[0], response.id);
          }
          this.linkEventIDList = responseList[1];
          // console.log('this.linkEventIDList => ', this.linkEventIDList)
          this.toastr.success('Event Successfully Linked', 'Event Link');
          this.blockedPanel = false;
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

      // this.blockedPanel = false;
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
      // console.log('This Link Events ', this.config.links)
    } else {
      this.config.links = [];
    }
  }

  print() {
    this.scheduler.control.exportAs("svg").print();
  }
  getFunctionByResourceId(resourceId, cb) {
    let func = null;
    for (let element of this.functionDropDown) {
      if (element.resources && !func) {
        if (element.resources.find(el => el.id == resourceId)) {
          func = element;
          break;
        }
      }
    }
    cb(func == null ? null : func.function.id);
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

  saveRecurrenceEvent(result) {
    this.blockedPanel = true;
    this.httpService.callApi('createRecurrenceEvent', { body: result }).subscribe((response) => {
      this.httpService.callApi('getAllEvents', { pathVariable: "/" + this.timeLineForm.get('functionName').value.function.id }).subscribe((responce) => {
        this.events = responce.filter(i => i.resource != this.defaultId);
        this.events.forEach(element => {
          element.start = new DayPilot.Date(moment(element.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss"));
          element.end = new DayPilot.Date(moment(element.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss"));
        })
        // console.log('  this.events  ', this.events)
        this.createlinkForEvent();
        this.blockedPanel = false;
        this.toastr.success("Recression created successfully","Event")
      }, (error) => {
        this.blockedPanel = false;
        this.toastr.error(error.error.message,"Event")
      });
    }, (error) => {
      this.toastr.error(error.error.message,"Event")
      this.blockedPanel = false;
    });
  }

  formatTime(time:DayPilot.Date){
    return time.toString("yyyy-MM-dd hh:mm")
  }
}

