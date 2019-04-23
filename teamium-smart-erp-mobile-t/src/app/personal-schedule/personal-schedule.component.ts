import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DayPilot, DayPilotCalendarComponent } from 'daypilot-pro-angular';
import { forkJoin } from 'rxjs';
import * as moment from 'moment-timezone';
import { MatDialog, MatDatepickerInputEvent } from '@angular/material';
import {PersonalScheduleModalComponent} from '../personal-schedule-modal/personal-schedule-modal.component'
import { HttpService } from '../core/services/http.service';
import { CommonDataService } from '../core/services/common-data.service';
declare var screen;
@Component({
  selector: 'app-personal-schedule',
  templateUrl: './personal-schedule.component.html',
  styleUrls: ['./personal-schedule.component.scss']
})
export class PersonalScheduleComponent implements OnInit {
  public configDay:any;
  public functionList: any = [];
  public projectList:any=[];
  @ViewChild("day") day: DayPilotCalendarComponent;
  events:any= [
  ]


  constructor(public cdRef: ChangeDetectorRef,public httpService: HttpService,public commonDataService: CommonDataService,public dialog: MatDialog) { 
    window.addEventListener("orientationchange", ()=>{
      if(screen.orientation.type=="landscape-primary"){
        this.configDay.viewType="WorkWeek";
        if (!this.cdRef['destroyed']) {
          this.cdRef.detectChanges();
        }
        
      }
      else{
        this.configDay.viewType="WorkDay";
        if (!this.cdRef['destroyed']) {
          this.cdRef.detectChanges();
        }
      }
   });
  }

  ngOnInit() {
    this.commonDataService.setActivePage('schedule');
    this.setSchedularConfiguration();
    this.getEvents();
  }

  getEvents=()=>{
    let userData=this.commonDataService.getLoggedInUserData();
    if(!userData.hasOwnProperty('user_id')){
      return;
    }
    let userId= userData['user_id'];
    // this.blockedPanel = true;
    let findStaffAPI = this.httpService.callApi('getProfileDetails', { pathVariable: "/" + userId });
    let userBookingAPI = this.httpService.callApi('findUserBookingByUser', { pathVariable: "/" + userId });
    let projectListAPI = this.httpService.callApi('findAllProjectTodoOrProgress', {});
    this.commonDataService.showSpinner();
    forkJoin([userBookingAPI, findStaffAPI, projectListAPI]).subscribe((responseList) => {
      this.commonDataService.hideSpinner();
      this.modifyData(responseList);
    }, (errorList) => {
      this.commonDataService.hideSpinner();
      console.error('errorList => ', errorList);
    });
  }

  modifyData=(responseList)=>{
    this.events = responseList[0];
    // create events List data
    this.events.forEach(el => {
      el.start = moment(el.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
      el.end = moment(el.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
      el.title = el.title + " (" + moment(el.startTime).format('hh:mm a').toUpperCase() + " - " + moment(el.endTime).format('hh:mm a').toUpperCase() + ")";
      if (el.bookingId) {
        el.moveDisabled = true
        el.resizeDisabled = true
      }
    });
    // create function List  data
    this.functionList = [];
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
    // create project List data
    this.projectList = responseList[2];
    this.projectList.push({
      id: "null",
      name: ""
    });

    // console.log(this.events,this.functionList,this.projectList)
  }
  

  setSchedularConfiguration=()=>{
    this.configDay = {
      // viewType: "WorkWeek",
      timeRangeDoubleClickHandling: "Enabled",
      businessBeginsHour: 8,
      businessEndsHour: 20,
      durationBarMode: "PercentComplete",
      heightSpec: "Full",
      eventArrangement: "SideBySide",
      cellHeight: 20,
      headerHeight: 30,
      hourWidth: 60,
      headerDateFormat: "dddd MM/dd",
      timeRangeSelectedHandling: "Enabled",
      eventHoverHandling: "Bubble",
      bubble: new DayPilot.Bubble({
        onLoad: (args) => {
          
        }
      }),
      onBeforeEventRender: args => {
        
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
        
        let html;
        args.data.collapse = true
        let string = args.data.collapse ? '../../assets/img/alert-icon.png' : null;
        if (string) {
          
        }
        let string1 = "<div  class=" + (args.data.selected ? "'test selected'" : "'test'") + " style='color: #fff;'><span>" + args.data.text + "</span></div>";
        args.data.html = html ? html + string1 : string1;
        args.data.barColor = args.data.status ? this.getStatusCode(args.data.status) : args.data.theme;
        args.data.barBackColor = args.data.status ? this.getStatusCode(args.data.status, true) : args.data.theme;
       
      },
      onEventMove: (args) => {
        this.changeEvent(args);
      },
      onEventResize: (args) => {
        this.changeEvent(args);
      },
      onEventClick: (args) => {
        this.openEventModal(args,true);
      },
      onTimeRangeSelected: (args) => {
        // this.openEventModal(args,false);
      }
    };
  }

  onEventDrop(event) {
    this.updateEvent(event);
  }

  onEventResize(event) {
    this.updateEvent(event);
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
    
  }

  handleDayClick(event) {
    const selectedMoment = event.start.value;
    let data = {
      functionList: this.functionList.filter(dt => dt.checked),
      from: event.start.value,
      to: event.end.value
    }
  }

  updateEvent(event) {
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

  onDateSelect(type: string, event: MatDatepickerInputEvent<Date>) {
    this.changeDate(event.value)
  }

  changeDate(newDate) {
    // console.log(newDate)
    let dt = new DayPilot.Date(newDate);
    // console.log(dt)
    // console.log(dt.toString())
    // console.log(moment.utc(newDate).local().format("YYYY-MM-DDTHH:mm:ss"))
    this.configDay.startDate = moment.utc(newDate).local().format("YYYY-MM-DDTHH:mm:ss")//moment(newDate).utc().format()//dt.toString();
    // moment.utc()
  } 

  openEventModal(args,update): void {
    let modalData={
      events:this.events,
      functionList:this.functionList,
      projectList:this.projectList,
      update
    }

    if(update){
      modalData['eventData']=args.e.data;
    }

    const dialogRef = this.dialog.open(PersonalScheduleModalComponent, {
      data:modalData,
      panelClass:"common-modal-view",
      maxWidth:"250px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==true){
        this.getEvents();
      }
    });
  }

  saveUserBooking(userBooking, edit?: boolean) {
    // this.blockedPanel = true;
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
      // this.blockedPanel = false;

      if (userBooking.createProject) {
        // this.toastr.success('Booking Created Successfully', 'Event');
        // this.commonDataService.openSnackBar("Booking Created Successfully",'warning');
      } else {
        if(edit){
          // this.toastr.success('Booking Updated Successfully', 'Event');
        }else{
          // this.toastr.success('Booking Created Successfully', 'Event');
        }
      }
    }, (error) => {
      // this.blockedPanel = false;
      console.log("Error");
      // this.toastr.success(error.error.description, 'Event');
    })
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

