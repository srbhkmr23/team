import { Component, OnInit } from '@angular/core';
import 'fullcalendar';
import { HttpService } from '../../core/services/http.service';
import { Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-project-agenda',
  templateUrl: './project-agenda.component.html',
  styleUrls: ['./project-agenda.component.scss']
})
export class ProjectAgendaComponent implements OnInit {

  events: any[] = [];
  header: any;
  blockedPanel: any;
  constructor(private httpService: HttpService, private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);

    this.header = {
      left: 'prev,next',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };
    this.blockedPanel = true;
    this.httpService.callApi('getEventForAllProject', {}).subscribe((response) => {
      this.events = response;
      this.events.forEach(el => {
        el.start = moment(el.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
        el.end = moment(el.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
        el.title = el.title + " (" + moment(el.startTime).format('hh:mm a').toUpperCase() + " - " + moment(el.endTime).format('hh:mm a').toUpperCase() + ")";
      });
      this.blockedPanel = false;
      // console.log('eventApi => ', this.events)
    }, (error) => {
      console.log('error => ', error)
      this.blockedPanel = false;
    });
  }

}
