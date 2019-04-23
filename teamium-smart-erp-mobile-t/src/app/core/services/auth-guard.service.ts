import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonDataService } from './common-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(public commonDataService: CommonDataService,public router: Router) {

  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let userInstance=this.commonDataService.getUserInstance();
    let userData=this.commonDataService.getLoggedInUserData();
    if(userInstance && userData.hasOwnProperty('user_id')){
      return true;
    }
    else{
      this.router.navigate(['/signin']);
      return false;
    }
  

    // navigate to login page
    // this._router.navigate(['/login']);
    // you can save redirect url so after authing we can move them back to the page they requested
    // return false;
  }
}
