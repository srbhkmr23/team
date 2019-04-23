import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonDataService } from './common-data.service';
@Injectable({
  providedIn: 'root'
})
export class LoginGuardService {

  constructor(public commonDataService: CommonDataService,public router: Router) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    let userInstance=this.commonDataService.getUserInstance();
    let userData=this.commonDataService.getLoggedInUserData();
    if(!userInstance){
      this.router.navigate(['']);
      return false;
    }

    if(userInstance && userData.hasOwnProperty('user_id')){
      this.router.navigate(['/teamium']);
      return false;
    }
    else{
      return true;
    }
    

  

  }
}
