import { Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { ConfigService } from './config.service';
@Injectable({
  providedIn: 'root'
})
export class CommonDataService {
  public activeSpinner:boolean=false;
  public activeSpinnerChange: Subject<boolean> = new Subject<boolean>();
  public activeSideBar:boolean=false;
  public activePage:any="";
  public loggedInUserData:any;
  public lastActivePage:any;

  
  constructor(public router: Router,public snackBar: MatSnackBar,public configService: ConfigService) {
    // try{
    //   this.router.events
    //   .pipe(filter((e: any) => e instanceof RoutesRecognized),
    //       pairwise()
    //   ).subscribe((e: any) => {
    //       // console.log(e[0].urlAfterRedirects); // previous url
    //       this.lastActivePage = e[0].urlAfterRedirects;
    //   });
    // }
    // catch(ex) {
    //   console.error(ex);
    // }
  }

  // spinner functions

  get isSpinnerctive(): boolean {
    return this.activeSpinner;
  }

  hideSpinner=()=>{
    this.activeSpinnerChange.next(false);
  }
  showSpinner=()=>{
    this.activeSpinnerChange.next(true);
  }

  // sidebar functionality

  toggleSideBar=()=> {
    this.activeSideBar=!this.activeSideBar;
  }
  get isSideBarActive(): boolean {
    return this.activeSideBar;
  }

  hideSideBar=()=>{
    this.activeSideBar=false;
  }

  showSideBar=()=>{
    this.activeSideBar=true;
  }

  // footer active page functionality
  get getActivePage(): string {
    return this.activePage;
  }

  setActivePage=(page)=>{
    let pages=['home','myJobs','schedule','message','notification',''];
    if(pages.indexOf(page)>-1){
      this.activePage=page;
    }
  }

  // loggedin user manage data functionality 

  getLoggedInUserData=()=>{
    if(this.loggedInUserData){
      return this.loggedInUserData || {};
    }
    else{
      let loggedInUserData =JSON.parse(localStorage.getItem('loggedInUserData')) || {};
      this.loggedInUserData=loggedInUserData;
      return this.loggedInUserData || {};
    }
  }

  setLoggedInUserData=(userData)=>{
    localStorage.setItem('loggedInUserData', JSON.stringify(userData));
    this.loggedInUserData=userData;
  }

  clearLoggedInUserData =()=>{
    localStorage.removeItem('loggedInUserData');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this.loggedInUserData=null;
  }

  // manage toaster (snackbar) 
  showSnackBar(message,type) {
    let toasterType={
      'success':'success-class',
      'error':'error-class',
      'warning':'warning-class'
    }

    this.snackBar.open(message, '',{
      panelClass: [toasterType[type]],
      duration: 2000
    } );
  }

  // logout
  logout() {
    localStorage.removeItem('loggedInUserData');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this.loggedInUserData=null;

    // check for default
    let defval = JSON.parse(localStorage.getItem('default'));
    if(defval!=true){
      localStorage.removeItem('userInstance');
      localStorage.removeItem('default');
    } 

    this.router.navigate(['signin']);
  }

  // get last active page

  getLastActivePage=()=>{
    return this.lastActivePage || '';
  }

  // manage user backend instance
  setUserInstance=(value,defVal)=>{
    localStorage.setItem('userInstance',value);
    localStorage.setItem('default',defVal);
  }

  getUserInstance=()=>{
    return localStorage.getItem('userInstance')
  }

  clearUserInstance=()=>{
    localStorage.removeItem('userInstance');
    localStorage.removeItem('default');
  }

  isUserInstanceExist=(value)=>{
    let isExist = this.configService.INSTANCES.hasOwnProperty(value);
    if(isExist){
      return true;
    }
    else {
      return false;
    }
  }

}
