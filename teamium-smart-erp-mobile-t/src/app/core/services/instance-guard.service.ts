import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonDataService } from './common-data.service';
@Injectable({
  providedIn: 'root'
})
export class InstanceGuardService {

  constructor(public commonDataService: CommonDataService,public router: Router) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    let userInstance=this.commonDataService.getUserInstance();
    if(userInstance){
      this.router.navigate(['/signin']);
      return false;
    }
    else{
      return true;
    }
  
  }
}
