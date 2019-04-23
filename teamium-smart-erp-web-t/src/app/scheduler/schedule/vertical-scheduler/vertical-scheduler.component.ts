import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import 'fullcalendar';
import { HttpService } from '../../../core/services/http.service';
import { Router } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import * as moment from 'moment-timezone';
import { DayPilot } from 'daypilot-pro-angular';
import { forkJoin } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-vertical-scheduler',
  templateUrl: './vertical-scheduler.component.html',
  styleUrls: ['./vertical-scheduler.component.scss']
})
export class VerticalSchedulerComponent implements OnInit {

  events: any[] = [];
  header: any;
  blockedPanel: any;
  dropdownData: any = [];
  options: any;
  functionDropDown: any;
  timeLineForm: FormGroup;
  allEvents: any = [];
  openOpion: boolean = false;
  searchText:string="";
  constructor(private httpService: HttpService, private dataService: DataService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);

    this.timeLineForm = this.formBuilder.group({
      functionName: [null]
    });

    this.timeLineForm.get('functionName').valueChanges.subscribe((value) => {
      console.log('enter value ', value);
      // this.events = [];
      // this.events = this.allEvents.filter(el => {
      //   if (el.functionId == value.function.id) {
      //     return true;
      //   }
      //   return false;
      // });
      console.log("this.events => ", this.events)
    });

    this.header = {
      left: 'prev,next',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };
    // this.options = {
    //   defaultDate: '2017-02-01',
    //   header: {
    //     left: 'prev,next',
    //     center: 'title',
    //     right: 'month,agendaWeek,agendaDay'
    //   }
    // };
    // this.options = { weekends: false };
    this.blockedPanel = true;
    let dropdownDataAPI = this.httpService.callApi('getProjectDropdown', {});
    let projectEventAPI = this.httpService.callApi('getEventForAllProject', {});
    let functionListApi = this.httpService.callApi('getAllAvailableFunctions', {});

    forkJoin([projectEventAPI, dropdownDataAPI, functionListApi]).subscribe((responseList) => {
      this.allEvents = JSON.parse(JSON.stringify(responseList[0]))
      this.events = this.allEvents;
      this.events.forEach(el => {
        el.start = moment(el.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
        el.end = moment(el.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
        el.title = el.title + " (" + moment(el.startTime).format('hh:mm a').toUpperCase() + " - " + moment(el.endTime).format('hh:mm a').toUpperCase() + ")";
      });
      this.dropdownData = responseList[1];
      this.functionDropDown = responseList[2];
      this.blockedPanel = false;
    }, (errorList) => {
      console.log('errorList => ', errorList)
      this.blockedPanel = false;
    });
  }

  handleDayClick(event) {
    const selectedMoment = event.date;
    let from = new DayPilot.Date(moment(new Date(selectedMoment)).tz("UTC").format("YYYY-MM-DD HH:mm:ss"));
    let data = {
      from: from,
      categories: this.dropdownData.categories
    }
  
  }

  handleEventClick(event) {
    const rosterEvent = event.calEvent
    if (rosterEvent.discriminator == "booking") {
      this.router.navigate(["teamium/project-booking/" + rosterEvent.recordId]);
    } else if (rosterEvent.discriminator == "budget") {
      this.router.navigate(["teamium/project-budgeting/" + rosterEvent.recordId]);
    }
  }

  saveBudget(data) {
    this.blockedPanel = true;
    this.httpService.callApi('saveProjectEvent', { body: data }).subscribe((response) => {
      response.start = moment(response.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
      response.end = moment(response.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
      this.events.push(response);
      this.blockedPanel = false;
    }, (error) => {
      console.log('error => ', error);
      this.blockedPanel = false;
    })
  }

  @HostListener('document:click', ['$event.target'])
  onClickedOutside(targetElement) {
    if (!targetElement.closest('#option-id') && this.openOpion) {
      this.openOpion = false;
    }
  }

}
