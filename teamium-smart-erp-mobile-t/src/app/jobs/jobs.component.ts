import { Component, OnInit } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import * as moment from 'moment-timezone';
import { CommonDataService } from '../core/services/common-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  jobList:any=[];
  constructor(public router: Router,public httpService: HttpService,public commonDataService: CommonDataService) { }

  ngOnInit() {
    this.commonDataService.setActivePage('myJobs');
    this.getJobs();
  }

  getJobs=()=>{   
    this.commonDataService.showSpinner();
    this.httpService.callApi('getBookingsByLoggedInUser', {}).subscribe((responce) => {
      this.commonDataService.hideSpinner();
      this.jobList=responce || [];
    }, error => {
      this.commonDataService.hideSpinner();
      console.error('Error getstatus => ', error)
    });
  }

  unAssignJob(job) {
    // this.blockedPanel = true;
    let event = job.event;
    if (event.resource) {
      event.changeable = false;
      this.commonDataService.showSpinner();
      this.httpService.callApi('unAssignJobToLoggedInUser', { pathVariable: job.id }).subscribe((resp) => {
         this.commonDataService.hideSpinner();
         this.getJobs();
      }, (error) => {
         this.commonDataService.hideSpinner();
        // this.toastr.error(error.error.message);
      });
    }
  }

  goToTaskDetails=(id)=>{
    this.router.navigate(['teamium/task-details/'+id]);
  }

  

  returnFromDate=(date)=>{
    // October 14th 10AM - 14th 6PM
  //  return moment(date).format("MMMM Do hA")
    return moment(date).format("MM/DD/YYYY h:mm A")
  }

  returnToDate=(date)=>{
  //  return moment(date).format("Do hA")
    return moment(date).format("MM/DD/YYYY h:mm A")
  }

}
