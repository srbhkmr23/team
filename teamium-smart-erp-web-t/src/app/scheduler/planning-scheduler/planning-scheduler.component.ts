import { Component, OnInit } from '@angular/core';
import 'fullcalendar';
import { HttpService } from '../../core/services/http.service';
import { Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';
@Component({
  selector: 'app-planning-scheduler',
  templateUrl: './planning-scheduler.component.html',
  styleUrls: ['./planning-scheduler.component.scss']
})
export class PlanningSchedulerComponent implements OnInit {
  events: any[] = [];
  header: any;
  bookingId: number;
  constructor(private httpService: HttpService, private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);
    // this.events = [

    // ];

    // this.events=this.http.getEvents();

    //     this.events.push({
    //       "id": 2,
    //   "title": "Long Event",
    //   "start": "2017-02-07",
    //   "end": "2017-02-10"
    // });

    this.httpService.getEvents().then(events => {
      this.events = events;
      // console.log('this.events ', this.events)
    });
    // this.bookingId = 4;
    // let getProjectEventApi = this.httpService.callApi('getProjectsEvent', { pathVariable: '/' + this.bookingId });
    // getProjectEventApi.subscribe((response) => {
    //   // this.events = response;
    //   // console.log('this.events ', this.events)
    // }, (error) => {
    //   console.log('error ', error)
    // })

    this.header = {
      left: 'prev,next',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };

    // console.log(' this.header ', this.header)
  }

  handleEventClick(event) {
    // console.log('Event Clicked ', event)
  }

  handleDayClick(event) {
    // console.log('Day Clicked Clicked ', event)
    const selectedMoment = event.date;
    // console.log('Slected date', selectedMoment.toDate());
  }

  mouseOver(event) {
    // console.log('mouseOver ', event)
  }

  onEventDrop(event) {
    // console.log('onEventDragStop ', event)
    let test = event.event.source.rawEventDefs.find(ev => ev.id == event.event.id);
    let index = event.event.source.rawEventDefs.findIndex(ev => ev.id == event.event.id);
    // test.title='hello'
    console.log('onEventDrop test ', test)
    console.log('index ', index)
    // this.events.splice(index, 1);

  }
  onEventResize(event) {
    let test = event.event.source.rawEventDefs.find(ev => ev.id == event.event.id);
    console.log(' onEventResize test ', test)
  }

}
