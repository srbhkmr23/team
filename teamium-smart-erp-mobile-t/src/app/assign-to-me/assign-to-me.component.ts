import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { HttpService } from '../core/services/http.service';
import { CommonDataService } from '../core/services/common-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assign-to-me',
  templateUrl: './assign-to-me.component.html',
  styleUrls: ['./assign-to-me.component.scss']
})
export class AssignToMeComponent implements OnInit {

  jobList:any=[]; 

  color = 'primary';
  mode = 'Indeterminate';
  value = 10;

  constructor(public router: Router, public httpService: HttpService,public commonDataService: CommonDataService) { }

  ngOnInit() {
    this.commonDataService.setActivePage('home');
    this.getJobs();
  }

  getJobs=()=>{   
    this.commonDataService.showSpinner();
    this.httpService.callApi('getBookingsByLoggedInUserUnassign', {pathVariable:"?currentUser=true"}).subscribe((responce) => {
      this.commonDataService.hideSpinner();
      this.jobList=responce || [];
    }, error => {
      this.commonDataService.hideSpinner();
      console.error('Error getstatus => ', error)
    });
  }

  assignToMe(job) {
    // this.blockedPanel = true;
    let event = job.event;
    if (event && event.resource) {
      event.changeable = false;
      this.commonDataService.showSpinner();
      this.httpService.callApi('assignJobToLoggedInUser', { body: [event] }).subscribe((resp) => {
        this.commonDataService.hideSpinner();
        this.getJobs();
        
      }, (error) => {
          this.commonDataService.hideSpinner();
      });
    }
  }

  goToTaskDetails=()=>{
    this.router.navigate(['teamium/task-details']);
  }

  returnFromDate=(date)=>{
    // October 14th 10AM - 14th 6PM
  //  return moment(date).format("MMMM Do h:mmA")
  return moment(date).format("MM/DD/YYYY h:mm A")

  }

  returnToDate=(date)=>{
  //  return moment(date).format("MMMM Do h:mmA")
  //  return moment(date).format("MMMM Do h:mmA")
  return moment(date).format("MM/DD/YYYY h:mm A")

  }

}
