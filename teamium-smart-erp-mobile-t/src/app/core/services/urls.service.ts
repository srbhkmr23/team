import { Injectable } from '@angular/core';
import { ConfigService } from './config.service'
import { CommonDataService } from './common-data.service';
@Injectable({
  providedIn: 'root'
})
export class UrlsService {
  urlObject: any;
  constructor(configService: ConfigService,public commonDataService: CommonDataService) {

    



    
    this.urlObject = {
      'login': {
        'method': 'POST',
        'url':  'oauth/token'
      },
      'getstatus': {
        'method': 'GET',
        'url':  'user/login-status'
      },
      'getLoggedInUser': {
        'method': 'GET',
        'url':  'staff/logged-in-user'
      },
      "getBookingsByLoggedInUserUnassign": {
        'method': 'GET',
        'url':  'booking'
      },
      "getBookingsByLoggedInUser": {
        'method': 'GET',
        'url':  'booking/by-logged-in-user/'
      },
      "assignJobToLoggedInUser": {
        'method': 'POST',
        'url':  'event/assign/to/logged-in-user'
      },
      "unAssignJobToLoggedInUser": {
        'method': 'POST',
        'url':  'booking/unassign/resource/'
      },
      "getTaskDetails": {
        'method': 'POST',
        'url':  'booking'
      },
      "startOrEndUserBookingTime": {
        'method': 'POST',
        'url':  'booking/add/start-or-end-time/'
      },
      "changeCompletionTimeOnBooking": {
        'method': 'POST',
        'url':  'booking/change-completion/'
      },
      "getProfileDetails":{
        'method': 'GET',
        'url':  'staff'
      },
      "getStaffDropdownData":{
        'method': 'GET',
        'url':  'staff/dropdown'
      },
      'saveProfileDetails': {
        'method': 'POST',
        'url':  'staff'
      },
      "findUserBookingByUser": {
        'method': 'GET',
        'url':  'user-booking'
      },
      "findAllProjectTodoOrProgress": {
        'method': 'GET',
        'url':  'project/progress'
      },
      "saveBookingFromUserScheduler": {
        'method': 'POST',
        'url':  'user-booking/time-report'
      }, 
      "saveOrUpdateUserBooking": {
        'method': 'POST',
        'url':  'user-booking'
      },
      "deleteUserBooking": {
        'method': 'DELETE',
        'url':  'user-booking'
      }, 
      'logout': {
        'method': 'POST',
        'url':  'user/logout'
      }

    }
  }
}
