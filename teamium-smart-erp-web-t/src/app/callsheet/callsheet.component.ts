import { Component, OnInit, HostListener } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';
import { ToastrService } from '../../../node_modules/ngx-toastr';
import { HttpService } from '../core/services/http.service';
import { CommonUtilService } from '../core/services/common-util-service';
import { DataService } from '../core/services/data.service';
import { UserDetailsService } from '../core/services/user-details.service';
import { forkJoin } from "rxjs/observable/forkJoin";
import { DayPilot } from "daypilot-pro-angular";
import { distinctUntilChanged } from 'rxjs/operators';
import 'rxjs/add/operator/distinctUntilChanged';
import * as moment from 'moment-timezone';
import { HttpParams } from '../../../node_modules/@angular/common/http';

import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { CheckBox } from '../core/entity/checkBox';
import { start } from 'repl';
@Component({
  selector: 'app-callsheet',
  templateUrl: './callsheet.component.html',
  styleUrls: ['./callsheet.component.scss']
})
export class CallsheetComponent implements OnInit {
  showEditProjectModal: boolean = false;
  projectDetail: any;
  projectId: number;
  dropdownDataAPI: any;
  projectDetailByIdAPI: any;
  dropdownData: any;
  resourceList: any = [];
  blockedPanel: boolean = false;
  extras: any = [];
  contactDetail: any = [];
  innerHeight: any;
  lineEditHeightStyle: any;
  findProjectByBudgetApi: any;
  pdfPrintContact: any = [];
  pdfPrintOrder: any = [];
  projectTitle: any;
  fileUrl: any;
  fileCleanUrl: any;
  page: any;
  tab: any;
  bookingDetailByBudgetIdAPI: any = [];
  orderLists: any = [];
  callsheetTitle: any;
  contactId:any={};
  editorText:any;
  comment:string;
  location:string;

  constructor(private activeRoute: ActivatedRoute, private sanitizer: DomSanitizer, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private toastr: ToastrService, private httpService: HttpService, private commonUtilService: CommonUtilService, private dataService: DataService, private userDetailsService: UserDetailsService) {
    this.innerHeight = window.innerHeight - 70 + 'Px';
  }

  ngOnInit() {
    this.route.params.subscribe(params => this.projectId = params.id);
    if (this.projectId.toString() == "undefined" && !this.dataService.pathVariable) {
      this.router.navigate(["/teamium/project-list"]);
    }
    this.dataService.checkSubmenu(this.router);
    this.bookingDetailByBudgetIdAPI = this.httpService.callApi('getBookingByBookingId', { pathVariable: this.projectId })
this.blockedPanel=true;
    forkJoin([this.bookingDetailByBudgetIdAPI]).subscribe(resultList => {
      let pathVariable: any = new Array();
      if (resultList[0]) {
        pathVariable.push({ "budgetId": resultList[0] });
      }
      pathVariable.push({ "projectId": this.projectId });
      this.dataService.addPathvariables(pathVariable);
     // this.blockedPanel = false;
    }, (errorList) => {
       //this.blockedPanel = false;
    });

    const routeParams = this.activeRoute;
    this.page = this.route.snapshot.url[0].path;
    this.tab = this.route.snapshot.url[1].path;
    console.log(this.route.snapshot.url[1].path);
   // this.blockedPanel = true;
    if (this.page === 'budgeting') {
      this.getBudgetCallSheet();
    }
    else if (this.page === 'booking') {
      if (this.tab === 'call-sheet'){
        this.callsheetTitle = "CallSheet";
      }
     else if (this.tab === 'packing-list'){
        this.callsheetTitle = "Packing List";
      }
      else if (this.tab === 'production-statement'){
        this.callsheetTitle = "Production Statement";
      }
      this.getBookingCallSheet();
      
    }
    else if (this.page === 'purchase-order') {
      // this.projectDetail = [];
      this.getProcurmentData();

    }
  }

  getBudgetCallSheet() {
    this.pdfPrintContact[0] = false;
    this.callsheetTitle = "Quotation";
    this.route.params.subscribe(params => this.projectId = params.id);
    this.dropdownDataAPI = this.httpService.callApi('getProjectDropdown', {});
    this.projectDetailByIdAPI = this.httpService.callApi('getProjectById', { pathVariable: this.projectId });
    this.findProjectByBudgetApi = this.httpService.callApi('getProjectByBudget', { pathVariable: '/' + this.projectId });
//this.blockedPanel=true;
    forkJoin([this.dropdownDataAPI, this.projectDetailByIdAPI, this.findProjectByBudgetApi]).subscribe(resultList => {
      this.dropdownData = resultList[0];
      this.projectDetail = resultList[1];
      this.projectTitle = resultList[1].title;
      this.contactDetail = resultList[1].recordContacts;

      this.resourceList = this.dropdownData.functionsByType.equipment;

      this.blockedPanel = false;
    }, (errorList) => {
      console.log('Error[0] ', errorList[0]);
      console.log('Error[0] ', errorList[1]);
      this.blockedPanel = false;

    });
  }

  getBookingCallSheet() {
    
    // this.pdfPrint[0] = false;
    //this.blockedPanel = true;

    this.route.params.subscribe(params => this.projectId = params.id);
    let findBudgetIdFromProjectIdApi = this.httpService.callApi('findBudgetIdFromProjectId', { pathVariable: "/" + this.projectId });
    this.dropdownDataAPI = this.httpService.callApi('getProjectDropdown', {});
    this.bookingDetailByBudgetIdAPI = this.httpService.callApi('getBookingByBookingId', { pathVariable: this.projectId })


    forkJoin([this.dropdownDataAPI, findBudgetIdFromProjectIdApi, this.bookingDetailByBudgetIdAPI]).subscribe(resultList => {

      this.projectDetail = resultList[2];
      this.contactDetail = resultList[2].recordContacts;
      this.projectTitle = resultList[2].title;
      this.blockedPanel = false;
    }, (errorList) => {
      console.log('Error[0] ', errorList[0]);
      console.log('Error[0] ', errorList[1]);
      this.blockedPanel = false;

    });
  }

  getProcurmentData() {
  //this.blockedPanel=true;
    this.callsheetTitle = "Purchase Order";
    this.route.params.subscribe(params => this.projectId = params.id);
    this.bookingDetailByBudgetIdAPI = this.httpService.callApi('getProcurmentByProjectId', { pathVariable: "/" + this.projectId });
    let ordersByProjectAPI = this.httpService.callApi('getOrdersByProjectId', { pathVariable: this.projectId });
    forkJoin([this.bookingDetailByBudgetIdAPI, ordersByProjectAPI]).subscribe(resultList => {
      this.projectDetail = resultList[0];
      this.orderLists = resultList[1];
      this.projectTitle = resultList[0].title;

      this.blockedPanel = false;
    }, (errorList) => {
      console.log('Error[0] ', errorList[0]);
      console.log('Error[1] ', errorList[1]);
      console.log('Error[2] ', errorList[2]);
      this.blockedPanel = false;
    });
  }

  /*-To close create-equipment component and refresh it. -*/
  closeModal($event) {
    this.showEditProjectModal = $event;
    this.ngOnInit();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = window.innerHeight - 70 + 'Px';
    //  this.lineEditHeightStyle=JSON.stringify( {
    //   'max-height': innerHeight + 'px',
    //   'overflow': 'auto'
    // });
  }

  getText=(event)=>{
    console.log(event);
    this.editorText = event.htmlValue.replace(/<\/br>/g,"<br/>"); 

  }

  pdfOnClick(id, index) {
   this.blockedPanel = true;
    if (this.page === 'budgeting') {
      this.pdfPrintContact[index] = true;
      let newURL = "?budgetId=" + this.projectId + "&contactId=" + id;

      this.httpService.callApi('printPDFForBudget', { pathVariable: newURL }).subscribe(response => {
        this.fileUrl = response.pdfUrl;
        this.fileCleanUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
         this.blockedPanel = false;
      })
    }
    else if (this.page === 'booking') {
      console.log(typeof this.editorText, this.editorText);
      let obj = {
        'projectId':this.projectId,
        'contactId':id,
        'orgnization':this.editorText,
        'location':this.location,
        'comment':this.comment,
      }

      //console.log(obj)
      if (this.tab === 'call-sheet'){
      this.httpService.callApi('printPDFForBooking', { body: obj }).subscribe(response => {
        this.fileUrl = response.pdfUrl;
        this.fileCleanUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
         this.blockedPanel = false;
      })
    }
    else if (this.tab === 'packing-list'){
      this.httpService.callApi('printPDFForPackingList', { body: obj }).subscribe(response => {
        this.fileUrl = response.pdfUrl;
        this.fileCleanUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
         this.blockedPanel = false;
      })
    }
    else if (this.tab === 'production-statement'){
       //this.contactId[index] = this.contactId[index]?this.contactId[index]:null;
      let newURL = "?projectId=" + this.projectId + "&contactId=" + id;
      if(this.comment){
        newURL += "&comments=" +this.comment;
      }
      this.pdfPrintOrder[index] = true;
      this.httpService.callApi('printPDFForProductionStatement', { pathVariable: newURL }).subscribe(response => {
        this.fileUrl = response.pdfUrl;
        this.fileCleanUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
         this.blockedPanel = false;
      })
    }
    }
    else if (this.page === 'purchase-order') {
      // console.log(this.contactId[index])
      this.contactId[index] = this.contactId[index]?this.contactId[index]:null;
      let newURL = "?orderId=" + id + "&contactId=" + this.contactId[index];
      this.pdfPrintOrder[index] = true;
      this.httpService.callApi('printPDFForOrder', { pathVariable: newURL }).subscribe(response => {
        this.fileUrl = response.pdfUrl;
        this.fileCleanUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
         this.blockedPanel = false;
      })
    }

  }
}
