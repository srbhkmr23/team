import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public isWrapperActive:boolean;
  constructor(){
      this.isWrapperActive=false;
  }

  
}
