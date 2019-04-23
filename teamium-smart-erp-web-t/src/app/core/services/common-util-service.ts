import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonUtilService {

  constructor() { }
  getDayDiffBetweenTwoDays(firstDate:Date ,secondDate:Date): number {
    var diff = Math.abs(firstDate.getTime() -secondDate.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    console.log(diffDays);
    return diffDays;
  }
   isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
}
