import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';
import { CommonDataService } from '../core/services/common-data.service';
import { HttpService } from '../core/services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {

  public task:any;
  public workOrderKeywordList:any=[];
  public taskId:any;
  public slideValue:any;
  constructor( public httpService: HttpService,public commonDataService: CommonDataService,public route: ActivatedRoute,public _location: Location, public router: Router) { }

  ngOnInit() {
    this.commonDataService.setActivePage('myJobs');
    this.taskId = this.route.snapshot.paramMap.get("id")
    this.getTaskDetails(this.taskId);

  }

  getTaskDetails=(taskId)=>{   
    this.commonDataService.showSpinner();
    this.httpService.callApi('getTaskDetails', {pathVariable:'/'+taskId}).subscribe((responce) => {
      this.commonDataService.hideSpinner();
      this.task=responce;

      if(this.task && this.task.workOrder && this.task.workOrder.keywords){
        this.workOrderKeywordList = this.task.workOrder.keywords || []
      }
    }, error => {
      this.commonDataService.hideSpinner();
      console.error('Error getstatus => ', error)
    });
  }

  startOrEndUserBookingTime(myBooking, start) {
    let pathVariables = myBooking.id + "/" + start;
    if (start && myBooking.userStartTime) {
      alert('Booking already started.')
      // this.toastr.warning('Booking already started.');
    } else if (!start && !myBooking.userStartTime) {
      alert('Please start booking first.')
      // this.toastr.warning('Please start booking first.');
    } else if (myBooking.userEndTime) {
      alert('Booking already ended.')
      // this.toastr.warning('Booking already ended.');
    } else {
      this.commonDataService.showSpinner();
      this.httpService.callApi('startOrEndUserBookingTime', { pathVariable: pathVariables }).subscribe((resp) => {
        this.commonDataService.hideSpinner();
        this.getTaskDetails(this.taskId);
      }, (error) => {
        this.commonDataService.hideSpinner();
      });
    }
  }

  handleBookingCompletionChanges(value,booking) {
    this.commonDataService.showSpinner();
    let pathVariables = booking.id + "/" + value;
    this.httpService.callApi('changeCompletionTimeOnBooking', { pathVariable: pathVariables }).subscribe((resp) => {
      this.commonDataService.hideSpinner();
      this.getTaskDetails(this.taskId);
    }, (error) => {
      this.commonDataService.hideSpinner();      
    });
  }

  onInputChange(event: any) {
    this.slideValue=event.value
  }

  getFormatedDate(date) {
    return moment(date).tz("Asia/Calcutta").format();
  }

  goBack=()=>{
    this._location.back();
    // let lastActivePage = this.commonDataService.getLastActivePage();
    // this.router.navigate([lastActivePage]);
    
  }
}
