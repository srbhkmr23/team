import { Component, OnInit, ViewChild, HostListener, AfterViewChecked } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { DataService } from '../../core/services/data.service';
import { Router } from '@angular/router';
import { RosterEventComponent } from './roster-event/roster-event.component';
import { forkJoin } from 'rxjs';
import * as moment from 'moment-timezone';
import { DayPilot, DayPilotCalendarComponent, DayPilotMonthComponent } from 'daypilot-pro-angular';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit, AfterViewChecked {

  @ViewChild("rosterEvent") rosterEvent: RosterEventComponent;

  events: any[] = [];
  header: any;
  bookingId: number;
  items: any;
  functionList: any = [];
  blockedPanel: boolean = false;
  filteredEvent: any = [];
  checkedAll: boolean = false;
  openOpion: boolean = false;
  showHoliday: boolean;
  hiddenWeekend: boolean = true;
  dateString: string;
  copyEvent: any = null;

  ngAfterViewChecked(): void {
    var y = document.getElementsByClassName("month_default_main");
    if (y && y[0]) {
      if (y[0].children && y[0].children.length > 2) {
        y[0].children[2].setAttribute("style", "height: calc(100vh - 185px ) !important;overflow-y: auto !important;padding:0 10px;");
      }
    }
  }

  @ViewChild("day") day: DayPilotCalendarComponent;
  @ViewChild("week") week: DayPilotCalendarComponent;
  @ViewChild("month") month: DayPilotMonthComponent;
  eventApi;
  constructor(private httpService: HttpService, private dataService: DataService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.blockedPanel = true;
    this.dataService.checkSubmenu(this.router);
    this.header = {
      left: 'prev,next',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };

    this.eventApi = this.httpService.callApi('getAllRosterEvent', {});
    let functionDropdowApi = this.httpService.callApi('getAllAvailableFunctions', {});
    forkJoin([functionDropdowApi, this.eventApi]).subscribe((responseList) => {
      if (responseList[0]) {
        this.functionList = responseList[0].filter(el => el.function.type == "Personnel");
        this.functionList.forEach(element => {
          element.checked = false;
        });
      }
      if (responseList[1]) {
        this.events = responseList[1];

        this.events.forEach(el => {
          el.start = moment(el.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
          el.end = moment(el.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
          // el.color = el.theme
          el.text = el.title
          el.theme = el.color;
        });
        this.blockedPanel = false;
      }
    }, (errorList) => {
      this.blockedPanel = false;
    });

    // this.httpService.getEvents().then(events => {
    //   this.events = events;
    //   console.log('this.events ', this.events)
    // });
    this.viewWeek();
    this.check();
  }

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
      let dt = new DayPilot.Date(this.configWeek.startDate).addDays(value * 7).firstDayOfWeek().addDays(this.hiddenWeekend ? 1 : 0);
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
    this.configMonth.startDate = newDate
  }

  handleEventClick(event) {
    const rosterEvent = event;
    let data = {
      id: rosterEvent.id,
      functionId: rosterEvent.functionId,
      resources: rosterEvent.resourcesDto,
      functionList: this.functionList,
      from: rosterEvent.start,
      to: rosterEvent.end,
      quantity: rosterEvent.quantity
    }
    this.rosterEvent.show(data).subscribe(result => {
      if (!result) {
        return; // cancelled
      }
      this.saveEvent(result);
    });
  }

  handleDayClick(event) {
    const selectedMoment = event.start.value;
    // let from = new DayPilot.Date(moment(new Date(selectedMoment)).tz("UTC").format("YYYY-MM-DD HH:mm:ss"));
    // let to = new DayPilot.Date(moment(new Date(selectedMoment)).tz("UTC").format("YYYY-MM-DD HH:mm:ss")).addHours(4);
    let data = {
      functionList: this.functionList.filter(dt => dt.checked),
      from: event.start.value,
      to: event.end.value
    }
    this.rosterEvent.show(data).subscribe(result => {
      if (!result) {
        return; // cancelled
      }
      this.saveEvent(result);
    });
  }

  onEventDrop(event) {
    this.updateEvent(event);
  }

  onEventResize(event) {
    this.updateEvent(event);
  }

  updateEvent(event) {
    let rosterEvent = this.events.find(ev => ev.id == event.e.data.id);
    if (rosterEvent) {
      rosterEvent.startTime = moment(event.newStart.value).tz("Asia/Calcutta").format();
      rosterEvent.endTime = moment(event.newEnd.value).tz("Asia/Calcutta").format();
      this.saveEvent(rosterEvent);
      // console.log("rosterEvent => ",rosterEvent)
    }
  }

  saveEvent(rosterEvent) {
    this.blockedPanel = true;
    this.httpService.callApi('saveOrUpdateRosterEvent', { body: rosterEvent }).subscribe((response) => {
      this.updateAllEvents(response, true);
      this.toastr.success("Successfully Saved", 'Roster');

      // console.log("response => ", response)
      // response.start = moment(response.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
      // response.end = moment(response.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
      // response.text = response.title
      // response.theme = response.color;
      // this.events = JSON.parse(JSON.stringify(this.events));
      // this.filteredEvent = JSON.parse(JSON.stringify(this.filteredEvent));
      // if (rosterEvent.id) {
      //   let index = this.events.findIndex(el => el.id == response.id);
      //   if (index > -1) {
      //     this.events.splice(index, 1, response);
      //   }
      //   index = this.filteredEvent.findIndex(el => el.id == response.id);
      //   console.log('index => ', index)
      //   if (index > -1) {
      //     this.filteredEvent.splice(index, 1, response);
      //   }
      // } else {
      //   this.events.push(response);
      //   this.filteredEvent.push(response);
      // }

      // this.blockedPanel = false;
    }, (error) => {
      this.blockedPanel = false;
      this.toastr.error('Update Event', error.error.message);
    });
  }

  @HostListener('document:click', ['$event.target'])
  onClickedOutside(targetElement) {
    if (!targetElement.closest('#option-id') && this.openOpion) {
      this.openOpion = false;
    }
  }

  checkedAllOrUnCheckedAll() {
    this.filteredEvent = [];
    this.checkedAll = !this.checkedAll;
    this.functionList.forEach(element => {
      element.checked = this.checkedAll;
    });
    if (this.checkedAll) {
      this.filteredEvent = this.events;
    }
  }

  checkedFunction(functionValue) {
    functionValue.checked = !functionValue.checked;
    this.filteredEvent = [];
    this.functionList.filter(dt => dt.checked).forEach(element => {
      this.events.forEach(el => {
        if (el.functionId == element.function.id) {
          this.filteredEvent.push(el);
        }
      });
    });
  }

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
        // this.hoverEvent(args);
        args.html = args.source.data.title
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
        // let color = "rgba(" + this.hexToR(args.data.theme) + ", " + this.hexToG(args.data.theme) + ", " + this.hexToB(args.data.theme) + ",0.5)";
        args.data.backColor = args.data.theme;
      } else {
        args.data.backColor = "black";
      }
      // args.data.backColor = args.data.selected ? "#59c3ea" : args.data.theme;
      let html;
      // args.data.collapse = true
      let string = args.data.conflict ? '../../assets/img/alert-icon.png' : null;
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
      // args.data.barColor = args.data.status ? this.getStatusCode(args.data.status) : args.data.theme;
      // args.data.barBackColor = args.data.status ? this.getStatusCode(args.data.status, true) : args.data.theme;



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
      this.onEventDrop(args);
    },
    onEventResize: args => {
      this.onEventResize(args);
    },
    onEventClick: args => {
      this.handleEventClick(args.e.data);
    },
    onTimeRangeSelected: args => {
      this.handleDayClick(args);
    },
    contextMenu: new DayPilot.Menu({
      hideOnMouseOut: true,
      onShow: () => {
        this.openOpion = false;
      },
      items: [
        {
          text: "Copy",
          icon: 'fa fa-files-o',
          onClick: args => {
            // this.openOpion = true,
            this.copyEvent = args.source.data;
          }
        },
        {
          text: "Delete",
          icon: 'fa fa-trash',
          onClick: args => {
            let selectedEvent = args.source.data;
            this.deleteRosterEvent(selectedEvent);
          }
        }
      ]

    }),

    contextMenuSelection: new DayPilot.Menu({
      onShow: args => {
        args.menu.items[0].hidden = this.copyEvent == null;
        this.openOpion = false;
      },

      items: [
        {
          text: "Paste",
          icon: 'fa fa-clipboard',
          onClick: args => {
            let copyTo = args.source.start;
            if (this.copyEvent == null) {
              this.toastr.error("Event does not copied yet", 'Roster');
              return;
            }
            if (copyTo == null) {
              this.toastr.error("Invalid Date", 'Roster');
              return;
            } else {
              this.pasteRosterEvent(this.copyEvent, copyTo.value);
            }

          }
        }
      ]
    }),
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
    showToolTip : false,
    bubble: new DayPilot.Bubble({
      cssOnly: true,
      cssClassPrefix: "bubble_default",
      onLoad: args => {
        // this.hoverEvent(args);
        args.html = args.source.data.title
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
        // let color = "rgba(" + this.hexToR(args.data.theme) + ", " + this.hexToG(args.data.theme) + ", " + this.hexToB(args.data.theme) + ",0.5)";
        args.data.backColor = args.data.theme;
      } else {
        args.data.backColor = "black";
      }
      // args.data.backColor = args.data.selected ? "#59c3ea" : args.data.theme;
      let html;
      // args.data.collapse = true
      let string = args.data.conflict ? '../../assets/img/alert-icon.png' : null;
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
      // args.data.barColor = args.data.status ? this.getStatusCode(args.data.status) : args.data.theme;
      // args.data.barBackColor = args.data.status ? this.getStatusCode(args.data.status, true) : args.data.theme;
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
      this.onEventDrop(args);
    },
    onEventResize: args => {
      this.onEventResize(args);
    },
    onEventClick: args => {
      this.handleEventClick(args.e.data);
    },
    onTimeRangeSelected: args => {
      this.handleDayClick(args);
    },
    contextMenu: new DayPilot.Menu({
      hideOnMouseOut: true,
      onShow: () => {
        this.openOpion = false;
      },
      items: [
        {
          text: "Copy",
          icon: 'fa fa-files-o',
          onClick: args => {
            this.copyEvent = args.source.data;
          }
        },
        {
          text: "Delete",
          icon: 'fa fa-trash',
          onClick: args => {
            let selectedEvent = args.source.data;
            this.deleteRosterEvent(selectedEvent);
          }
        }
      ]
    }),

    contextMenuSelection: new DayPilot.Menu({
      onShow: args => {
        args.menu.items[0].hidden = this.copyEvent == null;
        this.openOpion = false;
      },

      items: [
        {
          text: "Paste",
          icon: 'fa fa-clipboard',
          onClick: args => {
            let copyTo = args.source.start;
            if (this.copyEvent == null) {
              this.toastr.error("Event does not copied yet", 'Roster');
              return;
            }
            if (copyTo == null) {
              this.toastr.error("Invalid Date", 'Roster');
              return;
            } else {
              this.pasteRosterEvent(this.copyEvent, copyTo.value);
            }

          }
        }
      ]
    }),
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
        // this.hoverEvent(args);
        args.html = args.source.data.title
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
        // let color = "rgba(" + this.hexToR(args.data.theme) + ", " + this.hexToG(args.data.theme) + ", " + this.hexToB(args.data.theme) + ",0.5)";
        args.data.backColor = args.data.theme;
      } else {
        args.data.backColor = "black"
      }
      // args.data.backColor = args.data.selected ? "#59c3ea" : args.data.theme;
      let html;
      // args.data.collapse = true
      let string = args.data.conflict ? '../../assets/img/alert-icon.png' : null;
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
      // args.data.barColor = args.data.status ? this.getStatusCode(args.data.status) : args.data.theme;
      // args.data.barBackColor = args.data.status ? this.getStatusCode(args.data.status, true) : args.data.theme;
    },
    onEventMove: args => {
      this.onEventDrop(args);
    },
    onEventResize: args => {
      this.onEventResize(args);
    },
    onEventClick: args => {
      this.handleEventClick(args.e.data);
    },
    onTimeRangeSelected: args => {
      this.handleDayClick(args);
    },
    contextMenu: new DayPilot.Menu({
      hideOnMouseOut: true,
      onShow: () => {
        this.openOpion = false;
      },
      items: [
        {
          text: "Copy",
          icon: 'fa fa-files-o',
          onClick: args => {
            this.openOpion = true,
              this.copyEvent = args.source.data;
          }
        },
        {
          text: "Delete",
          icon: 'fa fa-trash',
          onClick: args => {
            let selectedEvent = args.source.data;
            this.deleteRosterEvent(selectedEvent);
          }
        }
      ]

    }),

    contextMenuSelection: new DayPilot.Menu({
      onShow: args => {
        args.menu.items[0].hidden = this.copyEvent == null;
        this.openOpion = false;
      },
      items: [
        {
          text: "Paste",
          icon: 'fa fa-clipboard',
          onClick: args => {
            let copyTo = args.source.start;
            if (this.copyEvent == null) {
              this.toastr.error("Event does not copied yet", 'Roster');
              return;
            }
            if (copyTo == null) {
              this.toastr.error("Invalid Date", 'Roster');
              return;
            } else {
              this.pasteRosterEvent(this.copyEvent, copyTo.value);
            }

          }
        }
      ]
    }),
  };

  viewDay(): void {
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
  }

  viewMonth(): void {
    this.configDay.visible = false;
    this.configWeek.visible = false;
    this.configMonth.visible = true;
    let dt = new DayPilot.Date(this.configMonth.startDate);
    this.dateString = dt.toString("MMMM yyyy")
    // this.configMonth.showWeekend = this.showHoliday;
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
  }

  /**
   * To update roster-event list
   * 
   * @param response 
   * @param isEdit 
   */
  updateAllEvents(response, isEdit: boolean) {
    this.eventApi.subscribe((res) => {
      this.events = res;

      this.events.forEach(el => {
        el.start = moment(el.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
        el.end = moment(el.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
        // el.color = el.theme
        el.text = el.title
        el.theme = el.color;
      });
      let fil = this.filteredEvent.map(el => el.id);
      let value = fil.find(el => el == response.id);
      if (!value) {
        if (isEdit) {
          fil.push(response.id)
        } else {
          fil.pop(response.id)
        }
      }

      this.filteredEvent = [];
      fil.forEach(element => {
        let event = this.events.find(el => el.id == element);
        if (event) {
          this.filteredEvent.push(event);
        }
      });
      this.blockedPanel = false;
    }, (error) => {
      this.blockedPanel = false;
    });
  }

  /**
   * To delete roster event by id
   * 
   * @param selectedEvent 
   */
  deleteRosterEvent(selectedEvent) {
    this.blockedPanel = true;
    if (selectedEvent.id) {
      if (confirm('Are you sure to delete this roster?')) {
        this.httpService.callApi('deleteRosterEventById', { pathVariable: selectedEvent.id }).subscribe((response) => {
          this.toastr.success("Successfully Deleted", 'Roster');
          this.updateAllEvents(selectedEvent, false);
          this.copyEvent = null;
        }, error => {
          this.toastr.error(error.error.message, 'Roster');
        });
        this.blockedPanel = false;
      } else {
        this.blockedPanel = false;
      }
    }
  }

  /**
   * To paste roster-event
   * 
   * @param selectedEvent
   * @param copyTo 
   */
  pasteRosterEvent(selectedEvent, copyTo: string) {
    this.blockedPanel = true;
    if (selectedEvent.id) {
      if (confirm('Are you sure to paste this roster?')) {
        let urlStringParams = selectedEvent.id + "?copyTo=" + copyTo;
        this.httpService.callApi('pasteRosterEvent', { pathVariable: urlStringParams }).subscribe((response) => {
          this.toastr.success("Successfully Pasted", 'Roster');
          this.updateAllEvents(response, true);
          this.copyEvent = null;
        }, error => {
          this.toastr.error(error.error.message, 'Roster');
        });
        this.blockedPanel = false;
      } else {
        this.blockedPanel = false;
      }
    }
  }

}
