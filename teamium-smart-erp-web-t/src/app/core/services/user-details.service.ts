import { Injectable, OnInit } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from '../../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {


  loggedInUserDetails: any;
  constructor(private httpService: HttpService) {
  }


  isValidateUserRoleForModule(roleName: string, cb) {
    this.getLoggedInUser((res) => {
      return cb(res.role.some(role => role.roleName === roleName))
    })
  }

  getLoggedInUser(cb) {
    if (!this.loggedInUserDetails) {
      this.httpService.callApi('getLoggedInUser', {}).subscribe((response) => {
        this.loggedInUserDetails = response;
        cb(this.loggedInUserDetails);
      }, (error) => {
        
      })
    } else {
      cb(this.loggedInUserDetails);
    }

  }

}
