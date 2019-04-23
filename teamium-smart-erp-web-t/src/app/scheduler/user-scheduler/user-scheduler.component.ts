import { Component, OnInit, ViewChild, AfterViewChecked, HostListener } from '@angular/core';
import { DayPilot, DayPilotCalendarComponent, DayPilotMonthComponent, DayPilotNavigatorComponent } from "daypilot-pro-angular";
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import * as moment from 'moment-timezone';
import { HttpService } from '../../core/services/http.service';
import { UserTaskComponent } from '../user-task/user-task.component';
import { DataService } from '../../core/services/data.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-scheduler',
  templateUrl: './user-scheduler.component.html',
  styleUrls: ['./user-scheduler.component.scss']
})
export class UserSchedulerComponent implements OnInit, AfterViewChecked {

  blockedPanel: boolean;
  timeLineForm: FormGroup;

  ngAfterViewChecked(): void {
    var y = document.getElementsByClassName("month_default_main");
    if (y && y[0]) {
      if (y[0].children && y[0].children.length > 2) {
        // y[0].children[1].setAttribute("style", "margin-left:10px;margin-right:10px;");
        y[0].children[2].setAttribute("style", "height: calc(100vh - 185px ) !important;overflow-y: auto !important;padding:0 10px;");
      }
    }
  }

  @ViewChild("day") day: DayPilotCalendarComponent;
  @ViewChild("week") week: DayPilotCalendarComponent;
  @ViewChild("month") month: DayPilotMonthComponent;
  @ViewChild("taskScheduled") taskScheduled: UserTaskComponent;
  events: any[] = [];
  showHoliday: boolean;

  configDay: any = {
    businessBeginsHour: 8,
    businessEndsHour: 20,
    // dayBeginsHour: 1,
    // dayEndsHour: 23,
    durationBarMode: "PercentComplete",
    heightSpec: "Parent100Pct",
    eventArrangement: "SideBySide",
    // height:"640px",
    // scrollLabelsVisible : true
    cellHeight: 30,
    headerHeight: 30,
    hourWidth: 60,
    headerDateFormat: "dddd d",
    timeRangeSelectedHandling: "Enabled",
    eventHoverHandling: "Bubble",
    bubble: new DayPilot.Bubble({
      onLoad: args => {
        this.hoverEvent(args);
      }
    }),
    onBeforeEventRender: args => {
      // console.log('Event args ',args.data)
      // args.data.barHidden = true;
      args.data.cssClass = args.data.selected ? "myclass" : "";
      args.data.complete = 50;
      if (args.data.selected) {
        args.data.backColor = "#59c3ea";
      } else if (args.data.theme) {
        let color = "rgba(" + this.hexToR(args.data.theme) + ", " + this.hexToG(args.data.theme) + ", " + this.hexToB(args.data.theme) + ",0.5)";
        args.data.backColor = color;
      } else {
        args.data.backColor = "black";
      }
      // args.data.backColor = args.data.selected ? "#59c3ea" : args.data.theme;
      let html;
      args.data.collapse = true
      let string = args.data.collapse ? '../../assets/img/alert-icon.png' : null;
      if (string) {
        // html = "<img src='" + string + "' class='alertImageIcon' alt=''>"
      }
      // let element = this.multipleSelect.find(el => el.id == args.data.id);
      // console.log('element => ', element)
      // args.data.html = html ? html + "<div class='test' style='padding: 5px 0px 0px 25px;color: #fff;'><span>" + args.data.text + "</span><br><span class='task-duration'>" + this.formatDuration(new DayPilot.Duration(args.data.start, args.data.end).totalMinutes()) + "</span><br><span> (" + moment(args.data.start.value).format('hh:mm a').toUpperCase() + " - " + moment(args.data.end.value).format('hh:mm a').toUpperCase() + ")" + "</span></div>" : "<div  class='test' style='padding: 5px 0px 0px 3px;color: #fff;'><span>" + args.data.text + "</span><br><span class='task-duration'>" + this.formatDuration(new DayPilot.Duration(args.data.start, args.data.end).totalMinutes()) + " </span><br><span>(" + moment(args.data.start.value).format('hh:mm a').toUpperCase() + " - " + moment(args.data.end.value).format('hh:mm a').toUpperCase() + ")" + "</span></div>";
      let string1 = "<div  class=" + (args.data.selected ? "'test selected'" : "'test'") + " style='color: #fff;'><span>" + args.data.text + "</span></div>";
      args.data.html = html ? html + string1 : string1;
      // console.log(' this.link ', this.link)
      // console.log(' this.linkEventIDList ', this.linkEventIDList)
      // let el = this.linkEventIDList.find(el => el == args.data.id);

      // let iconsList: any = [];
      // if (el) {
      // iconsList.push({ bottom: 9, left: string ? 38 : 8, icon: "fa fa-link", style: args.data.selected ? "font-size: 15px;color:#333" : "font-size: 15px;color:#fff" });
      // }
      // if (args.data.selected) {
      //   // iconsList.push({ bottom: 0, right: 6, icon: "fa fa-check", style: "font-size: 20px;color:#66ff33" });
      // }
      // args.data.areas = iconsList;
      // }

      // args.data.barColor = "red";
      // args.data.barBackColor = "black";

      // console.log('data => ',args.data)
      args.data.barColor = args.data.status ? this.getStatusCode(args.data.status) : args.data.theme;
      args.data.barBackColor = args.data.status ? this.getStatusCode(args.data.status, true) : args.data.theme;



      // // if (args.data.selected) {
      // var y = document.getElementsByClassName("scheduler_default_event");
      // // console.log(y[0])
      // // if( y['offsetParent'][0])
      // if (y[0]) {
      //   console.log('inside y => ', y[0])
      //   y[0].setAttribute("class", "blueClass");
      // }

      // }
    },
    onEventMove: args => {
      console.log("onEventMove")
      this.changeEvent(args);
    },
    onEventResize: args => {
      console.log("onEventResize")
      this.changeEvent(args);
    },
    onEventClick: args => {
      console.log("onEventClick => ", args)
      this.editEvent(args, false)
    },
    onTimeRangeSelected: args => {
      console.log("onTimeRangeSelected args => ", args)
      this.editEvent(args, true)
    }
  };

  configWeek: any = {
    businessBeginsHour: 8,
    businessEndsHour: 20,
    viewType: "WorkWeek",
    heightSpec: "Parent100Pct",
    eventArrangement: "SideBySide",
    // headerDateFormat: "MMM d/yyyy",
    // scrollLabelsVisible : true
    cellHeight: 30,
    headerHeight: 30,
    hourWidth: 60,
    headerDateFormat: "dddd d",
    eventHoverHandling: "Bubble",
    bubble: new DayPilot.Bubble({
      onLoad: args => {
        this.hoverEvent(args);
      }
    }),
    onBeforeEventRender: args => {
      // console.log('Event args ',args.data)
      // args.data.barHidden = true;
      args.data.cssClass = args.data.selected ? "myclass" : "";
      args.data.complete = args.data.completion;
      if (args.data.selected) {
        args.data.backColor = "#59c3ea";
      } else if (args.data.theme) {
        let color = "rgba(" + this.hexToR(args.data.theme) + ", " + this.hexToG(args.data.theme) + ", " + this.hexToB(args.data.theme) + ",0.5)";
        args.data.backColor = color;
      } else {
        args.data.backColor = "black";
      }
      // args.data.backColor = args.data.selected ? "#59c3ea" : args.data.theme;
      let html;
      args.data.collapse = true
      let string = args.data.collapse ? '../../assets/img/alert-icon.png' : null;
      if (string) {
        // html = "<img src='" + string + "' class='alertImageIcon' alt=''>"
      }
      // let element = this.multipleSelect.find(el => el.id == args.data.id);
      // console.log('element => ', element)
      // args.data.html = html ? html + "<div class='test' style='padding: 5px 0px 0px 25px;color: #fff;'><span>" + args.data.text + "</span><br><span class='task-duration'>" + this.formatDuration(new DayPilot.Duration(args.data.start, args.data.end).totalMinutes()) + "</span><br><span> (" + moment(args.data.start.value).format('hh:mm a').toUpperCase() + " - " + moment(args.data.end.value).format('hh:mm a').toUpperCase() + ")" + "</span></div>" : "<div  class='test' style='padding: 5px 0px 0px 3px;color: #fff;'><span>" + args.data.text + "</span><br><span class='task-duration'>" + this.formatDuration(new DayPilot.Duration(args.data.start, args.data.end).totalMinutes()) + " </span><br><span>(" + moment(args.data.start.value).format('hh:mm a').toUpperCase() + " - " + moment(args.data.end.value).format('hh:mm a').toUpperCase() + ")" + "</span></div>";
      let string1 = "<div  class=" + (args.data.selected ? "'test selected'" : "'test'") + " style='color: #fff;'><span>" + args.data.text + "</span></div>";
      args.data.html = html ? html + string1 : string1;
      // console.log(' this.link ', this.link)
      // console.log(' this.linkEventIDList ', this.linkEventIDList)
      // let el = this.linkEventIDList.find(el => el == args.data.id);

      // let iconsList: any = [];
      // if (el) {
      // iconsList.push({ bottom: 9, left: string ? 38 : 8, icon: "fa fa-link", style: args.data.selected ? "font-size: 15px;color:#333" : "font-size: 15px;color:#fff" });
      // }
      // if (args.data.selected) {
      //   // iconsList.push({ bottom: 0, right: 6, icon: "fa fa-check", style: "font-size: 20px;color:#66ff33" });
      // }
      // args.data.areas = iconsList;
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
    },
    onEventMove: args => {
      console.log("onEventMove")
      this.changeEvent(args);
    },
    onEventResize: args => {
      console.log("onEventResize")
      this.changeEvent(args);
      // this.saveOrUpdateEvent([params]);
    },
    onEventClick: args => {
      console.log("onEventClick => ", args)
      this.editEvent(args, false)
    },
    onTimeRangeSelected: args => {
      console.log("onTimeRangeSelected args => ", args)
      this.editEvent(args, true)
    }
  };

  configMonth: any = {
    showWeekend: false,
    viewType: "Month",
    height: "Parent100Pct",
    cellHeight: 130,
    headerDateFormat: "dddd d",
    // scrollbar: "visible",
    // scrollLabelsVisible : true,
    // heightSpec: "Parent100Pct",
    // scrollLabelsVisible : true
    // cellHeight: 30,
    // headerHeight: 30,
    // hourWidth: 60,
    eventHoverHandling: "Bubble",
    bubble: new DayPilot.Bubble({
      onLoad: args => {
        this.hoverEvent(args);
      }
    }),
    onBeforeEventRender: args => {
      // console.log('Event args ',args.data)
      // args.data.barHidden = true;
      args.data.cssClass = args.data.selected ? "myclass" : "";
      args.data.complete = args.data.completion;
      if (args.data.selected) {
        args.data.backColor = "#59c3ea";
      } else if (args.data.theme) {
        let color = "rgba(" + this.hexToR(args.data.theme) + ", " + this.hexToG(args.data.theme) + ", " + this.hexToB(args.data.theme) + ",0.5)";
        args.data.backColor = color;
      } else {
        args.data.backColor = "black"
      }
      // args.data.backColor = args.data.selected ? "#59c3ea" : args.data.theme;
      let html;
      args.data.collapse = true
      let string = args.data.collapse ? '../../assets/img/alert-icon.png' : null;
      if (string) {
        // html = "<img src='" + string + "' class='alertImageIcon' alt=''>"
      }
      // let element = this.multipleSelect.find(el => el.id == args.data.id);
      // console.log('element => ', element)
      // args.data.html = html ? html + "<div class='test' style='padding: 5px 0px 0px 25px;color: #fff;'><span>" + args.data.text + "</span><br><span class='task-duration'>" + this.formatDuration(new DayPilot.Duration(args.data.start, args.data.end).totalMinutes()) + "</span><br><span> (" + moment(args.data.start.value).format('hh:mm a').toUpperCase() + " - " + moment(args.data.end.value).format('hh:mm a').toUpperCase() + ")" + "</span></div>" : "<div  class='test' style='padding: 5px 0px 0px 3px;color: #fff;'><span>" + args.data.text + "</span><br><span class='task-duration'>" + this.formatDuration(new DayPilot.Duration(args.data.start, args.data.end).totalMinutes()) + " </span><br><span>(" + moment(args.data.start.value).format('hh:mm a').toUpperCase() + " - " + moment(args.data.end.value).format('hh:mm a').toUpperCase() + ")" + "</span></div>";
      let string1 = "<div  class=" + (args.data.selected ? "'test selected'" : "'test'") + " style='color: #fff;'><span>" + args.data.text + "</span></div>";
      args.data.html = html ? html + string1 : string1;
      // console.log(' this.link ', this.link)
      // console.log(' this.linkEventIDList ', this.linkEventIDList)
      // let el = this.linkEventIDList.find(el => el == args.data.id);

      let iconsList: any = [];
      // if (el) {
      // iconsList.push({ bottom: 9, left: string ? 38 : 8, icon: "fa fa-link", style: args.data.selected ? "font-size: 15px;color:#333" : "font-size: 15px;color:#fff" });
      // }
      // if (args.data.selected) {
      //   // iconsList.push({ bottom: 0, right: 6, icon: "fa fa-check", style: "font-size: 20px;color:#66ff33" });
      // }
      // args.data.areas = iconsList;
      // }
      args.data.barColor = args.data.status ? this.getStatusCode(args.data.status) : args.data.theme;
      args.data.barBackColor = args.data.status ? this.getStatusCode(args.data.status, true) : args.data.theme;
    },
    onEventMove: args => {
      console.log("onEventMove")
      this.changeEvent(args);
    },
    onEventResize: args => {
      console.log("onEventResize")
      this.changeEvent(args);
    },
    onEventClick: args => {
      console.log("onEventClick => ", args)
      this.editEvent(args, false)
    },
    onTimeRangeSelected: args => {
      this.editEvent(args, true)
    }
  };

  constructor(private httpService: HttpService, private dataService: DataService, private router: Router, private formBuilder: FormBuilder, private toastr: ToastrService) {
    this.viewWeek();
  }
  public functionList: any = [];
  public projectList: any = [];
  ngOnInit(): void {
    this.dataService.checkSubmenu(this.router);

    this.timeLineForm = this.formBuilder.group({
      weekend: [false]
    });
    this.timeLineForm.get("weekend").valueChanges.subscribe((value) => {
      this.check();
    })
    this.blockedPanel = true;
    let findStaffAPI = this.httpService.callApi('getPersonalById', { pathVariable: "/" + sessionStorage.getItem('userId') });
    let userBookingAPI = this.httpService.callApi('findUserBookingByUser', { pathVariable: "/" + sessionStorage.getItem('userId') });
    let projectListAPI = this.httpService.callApi('findAllProjectTodoOrProgress', {});
    forkJoin([userBookingAPI, findStaffAPI, projectListAPI]).subscribe((responseList) => {
      // this.allEvents = JSON.parse(JSON.stringify(responseList[0]))
      this.events = responseList[0];
      this.events.forEach(el => {
        el.start = moment(el.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
        el.end = moment(el.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
        el.title = el.title + " (" + moment(el.startTime).format('hh:mm a').toUpperCase() + " - " + moment(el.endTime).format('hh:mm a').toUpperCase() + ")";
        if (el.bookingId) {
          el.moveDisabled = true
          el.resizeDisabled = true
        }
      });

      if (responseList[1].resource && responseList[1].resource.functions) {
        responseList[1].resource.functions.forEach(element => {
          if (element.function) {
            this.functionList.push({
              id: element.function.id,
              name: element.function.qualifiedName
            });
          }
        });
      }
      this.projectList = responseList[2];
      this.projectList.push({
        id: "null",
        name: ""
      });
      console.log(" this.functionList => ", this.functionList)
      console.log('this.projectList => ', this.projectList)

      // responseList[1].forEach(el => {
      //   el.start = moment(el.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
      //   el.end = moment(el.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
      //   el.title = el.title + " (" + moment(el.startTime).format('hh:mm a').toUpperCase() + " - " + moment(el.endTime).format('hh:mm a').toUpperCase() + ")"
      //   this.events.push(el);
      // });

      // this.dropdownData = responseList[1];
      // this.functionDropDown = responseList[2];
      this.blockedPanel = false;
    }, (errorList) => {
      console.log('errorList => ', errorList)
      this.blockedPanel = false;
    });
  }

  viewDay(): void {
    console.log("viewDay() this.showHoliday => ", this.showHoliday)
    // this.day.control.init();
    this.configDay.visible = true;
    this.configWeek.visible = false;
    this.configMonth.visible = false;
    let dt = new DayPilot.Date(this.configWeek.startDate);
    this.dateString = dt.toString("MMMM d, yyyy")
  }

  viewWeek(): void {

    this.configDay.visible = false;
    this.configWeek.visible = true;
    this.configMonth.visible = false;
    let dt = new DayPilot.Date(this.configWeek.startDate).firstDayOfWeek();
    if (this.hiddenWeekend) {
      let day = dt.toString("dddd");
      if (day == "Saturday") {
        dt = dt.addDays(2);
      } else if (day == "Sunday") {
        dt = dt.addDays(1);
      }
    }
    let lastDate = dt.addDays(this.hiddenWeekend ? 4 : 6);
    this.dateString = dt.getYear() != lastDate.getYear() ? dt.toString("MMM d, yyyy") + " - " + lastDate.toString("MMM d, yyyy") : dt.getMonth() != lastDate.getMonth() ? dt.toString("MMM d") + " - " + lastDate.toString("MMM d, yyyy") : dt.toString("MMM d") + " - " + lastDate.toString("d, yyyy")
    // this.configWeek.viewType = this.showHoliday ? "WorkWeek" : "Week"
    console.log("viewWeek() => ", this.configWeek.viewType)
  }

  viewMonth(): void {
    this.configDay.visible = false;
    this.configWeek.visible = false;
    this.configMonth.visible = true;
    let dt = new DayPilot.Date(this.configMonth.startDate);
    this.dateString = dt.toString("MMMM yyyy")
    // this.configMonth.showWeekend = this.showHoliday;
    console.log("viewMonth() this.configMonth.showWeekend => ", this.configMonth.showWeekend)
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
  dateString: string;
  hiddenWeekend: boolean = true;

  changeDate(value: number) {
    let newDate: String;
    if (this.configDay.visible) {
      let dt = new DayPilot.Date(this.configDay.startDate).addDays(value * 1);


      if (this.hiddenWeekend) {
        let day = dt.toString("dddd");
        if (day == "Saturday") {
          dt = dt.addDays(value > 0 ? value * 2 : value * 1);
        } else if (day == "Sunday") {
          dt = dt.addDays(value > 0 ? value * 1 : value * 2);
        }
      }
      newDate = dt.toString();
      this.configDay.startDate = newDate
      this.configWeek.startDate = newDate
      this.dateString = dt.toString("MMMM d, yyyy")

    } else if (this.configWeek.visible) {
      console.log("this.configWeek.startDate => ", this.configWeek.startDate)
      let dt = new DayPilot.Date(this.configWeek.startDate).addDays(value * 7).firstDayOfWeek().addDays(this.hiddenWeekend ? 1 : 0);
      console.log("dt => ", dt, " this.hiddenWeekend => ", this.hiddenWeekend)
      // if (this.hiddenWeekend) {
      //   let day = dt.toString("dddd");
      //   if (day == "Saturday") {
      //     dt = dt.addDays(value > 0 ? value * 2 : value * 1);
      //   } else if (day == "Sunday") {
      //     dt = dt.addDays(value > 0 ? value * 1 : value * 2);
      //   }
      // }
      newDate = dt.toString();
      this.configWeek.startDate = newDate
      this.configDay.startDate = dt.toString();
      let lastDate = dt.addDays(this.hiddenWeekend ? 4 : 6);
      console.log("newDate => ", newDate.toString(), " lastDate => ", lastDate.toString())
      this.dateString = dt.getYear() != lastDate.getYear() ? dt.toString("MMM d, yyyy") + " - " + lastDate.toString("MMM d, yyyy") : dt.getMonth() != lastDate.getMonth() ? dt.toString("MMM d") + " - " + lastDate.toString("MMM d, yyyy") : dt.toString("MMM d") + " - " + lastDate.toString("d, yyyy")
    } else {
      let dt = new DayPilot.Date(this.configMonth.startDate).addMonths(value * 1).firstDayOfMonth();
      if (this.hiddenWeekend) {
        let day = dt.toString("dddd");
        if (day == "Saturday") {
          dt = dt.addDays(value > 0 ? value * 2 : value * 1);
        } else if (day == "Sunday") {
          dt = dt.addDays(value > 0 ? value * 1 : value * 2);
        }
      }
      newDate = dt.toString();
      this.configWeek.startDate = dt.toString();
      this.configDay.startDate = dt.toString();
      this.dateString = dt.toString("MMMM yyyy")
    }

    console.log("changeDate " + this.dateString)
    this.configMonth.startDate = newDate
  }

  saveUserBooking(userBooking, edit?: boolean) {
    this.blockedPanel = true;
    console.log("userBooking.createProject  => ", userBooking.createProject)
    this.httpService.callApi(userBooking.createProject ? 'saveBookingFromUserScheduler' : 'saveOrUpdateUserBooking', { body: userBooking }).subscribe((response) => {
      response.start = moment(response.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
      response.end = moment(response.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
      if (response.bookingId) {
        response.moveDisabled = true
        response.resizeDisabled = true
      }
      if (edit) {
        let index = this.events.findIndex(el => el.id == response.id);
        if (index !== -1) {
          this.events.splice(index, 1);
        }
      }
      this.events.push(response);
      this.blockedPanel = false;

      if (userBooking.createProject) {
        this.toastr.success('Booking Created Successfully', 'Event');
      } else {
        if(edit){
          this.toastr.success('Booking Updated Successfully', 'Event');
        }else{
          this.toastr.success('Booking Created Successfully', 'Event');
        }
      }
    }, (error) => {
      this.blockedPanel = false;
      console.log("Error");
      this.toastr.success(error.error.description, 'Event');
    })
  }

  changeEvent(args) {
    let params = {
      id: args.e.id(),
      userStartTime: moment(args.newStart.value).tz("Asia/Calcutta").format(),
      userEndTime: moment(args.newEnd.value).tz("Asia/Calcutta").format(),
      text: args.e.data.text,
      staffMemberId: sessionStorage.getItem('userId')
    }
    this.saveUserBooking(params, true);
  }

  editEvent(args, isCreate: boolean) {
    let test = isCreate ? {
      start: args.start,
      end: args.end,
      projectList: this.projectList,
      functionList: this.functionList
    }
      : {
        data: args.e.data,
        isEditable: args.e.data.moveDisabled
      }
    this.taskScheduled.show(test, isCreate).subscribe(result => {
      console.log(' resultUpdate ', result)
      if (!result) {
        return; // cancelled
      } if (result.delete) {
        this.deleteUserBooking(result);
        return;
      }
      this.saveUserBooking(result, true);
    });
  }


  check() {
    this.showHoliday = !this.showHoliday;
    this.hiddenWeekend = !this.showHoliday;
    this.configWeek.viewType = !this.showHoliday ? "WorkWeek" : "Week"
    this.configMonth.showWeekend = this.showHoliday;
    if (this.configWeek.visible) {
      let dt = new DayPilot.Date(this.configWeek.startDate).firstDayOfWeek().addDays(this.hiddenWeekend ? 1 : 0);
      let lastDate = dt.addDays(this.hiddenWeekend ? 4 : 6);
      this.dateString = dt.getYear() != lastDate.getYear() ? dt.toString("MMM d, yyyy") + " - " + lastDate.toString("MMM d, yyyy") : dt.getMonth() != lastDate.getMonth() ? dt.toString("MMM d") + " - " + lastDate.toString("MMM d, yyyy") : dt.toString("MMM d") + " - " + lastDate.toString("d, yyyy")
    }
    console.log(" this.configWeek.viewType => ", this.configWeek.viewType)
    console.log(" this.configMonth.showWeekend => ", this.configMonth.showWeekend)
  }

  hoverEvent(args) {
    args.html = "<div style='padding: 0px 0px 0px 2px;color: black;'><span>" + args.source.data.text + "</span><br><span class='task-duration'>" + this.formatDuration(new DayPilot.Duration(args.source.data.start, args.source.data.end).totalMinutes()) + " (" + moment(args.source.data.start.value).format('hh:mm a').toUpperCase() + " - " + moment(args.source.data.end.value).format('hh:mm a').toUpperCase() + ")" + "</span></div>"
  }

  formatDuration(minutes: number): string {
    let result = Math.floor((minutes / (60 * 24))) + "d " + Math.floor((minutes % (60 * 24)) / 60) + "h " + Math.floor(minutes % 60) + "m";
    return result;
  }

  deleteUserBooking(result) {
    this.httpService.callApi('deleteUserBooking', { pathVariable: '/' + result.id }).subscribe((response) => {
      let index = this.events.findIndex(el => el.id == result.id);
      if (index !== -1) {
        this.events.splice(index, 1);
      }
    }, (error) => {

    })
  }
  openOpion: boolean;
  @HostListener('document:click', ['$event.target'])
  onClickedOutside(targetElement) {
    if (!targetElement.closest('#option-id') && this.openOpion) {
      this.openOpion = false;
    }
  }
}
