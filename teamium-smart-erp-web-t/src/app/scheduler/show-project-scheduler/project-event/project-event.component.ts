import { Component, OnInit, ViewChild } from '@angular/core';
import 'fullcalendar';
import { HttpService } from '../../../core/services/http.service';
import { Router } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import * as moment from 'moment-timezone';
import { CreateProjectEventComponent } from '../create-project-event/create-project-event.component';
import { DayPilot } from 'daypilot-pro-angular';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-project-event',
  templateUrl: './project-event.component.html',
  styleUrls: ['./project-event.component.scss']
})
export class ProjectEventComponent implements OnInit {

  @ViewChild("projectEvent") projectEvent: CreateProjectEventComponent;

  events: any[] = [];
  header: any;
  blockedPanel: any;
  dropdownData: any = [];

  constructor(private httpService: HttpService, private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);

    this.header = {
      left: 'prev,next',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };
    this.blockedPanel = true;
    let dropdownDataAPI = this.httpService.callApi('getProjectDropdown', {});
    let projectEventAPI = this.httpService.callApi('getProjectEvent', {});

    forkJoin([projectEventAPI, dropdownDataAPI]).subscribe((responseList) => {
      this.events = responseList[0];
      this.events.forEach(el => {
        el.start = moment(el.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
        el.end = moment(el.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
        el.title = el.title + " (" + moment(el.startTime).format('hh:mm a').toUpperCase() + " - " + moment(el.endTime).format('hh:mm a').toUpperCase() + ")";
      });
      this.dropdownData = responseList[1];
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
    this.projectEvent.show(data).subscribe(result => {
      if (!result) {
        return; // cancelled
      }
      this.saveBudget(result);
    });
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
}
