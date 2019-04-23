import { Component, OnInit, HostListener } from '@angular/core';
// import { Observable } from '../../../node_modules/rxjs';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';
// import { ToastrService } from '../../../node_modules/ngx-toastr';
import { HttpService } from '../core/services/http.service';
import { CommonUtilService } from '../core/services/common-util-service';
import { DataService } from '../core/services/data.service';
import { UserDetailsService } from '../core/services/user-details.service';
import { forkJoin } from "rxjs/observable/forkJoin";
// import { DayPilot } from "daypilot-pro-angular";
// import { distinctUntilChanged } from 'rxjs/operators';
import 'rxjs/add/operator/distinctUntilChanged';
// import * as moment from 'moment-timezone';
// import { HttpParams } from '../../../node_modules/@angular/common/http';

import {  DomSanitizer } from '@angular/platform-browser';
// import { CheckBox } from '../core/entity/checkBox';
// import { start } from 'repl';
@Component({
  selector: 'app-show-callsheet',
  templateUrl: './show-callsheet.component.html',
  styleUrls: ['./show-callsheet.component.scss']
})
export class ShowCallsheetComponent implements OnInit {
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
  bookingDetailByBudgetIdAPI: any = [];
  orderLists: any = [];
  callsheetTitle: any;
  contactId:any={};
  editorText:any;
  comment:string;
  location:string;
  contactList:any=[];

  constructor(private activeRoute: ActivatedRoute, private sanitizer: DomSanitizer, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private httpService: HttpService, private commonUtilService: CommonUtilService, private dataService: DataService, private userDetailsService: UserDetailsService) {
    this.innerHeight = window.innerHeight - 70 + 'Px';
  }

  ngOnInit() {
    this.route.params.subscribe(params => this.projectId = params.id);
    if (this.projectId.toString() == "undefined" && !this.dataService.pathVariable) {
      this.router.navigate(["/teamium/show-list"]);
    }
    this.dataService.checkSubmenu(this.router);
    let pathVariable: any = new Array(); 
    pathVariable.push({ "showId": this.projectId });
    this.dataService.addPathvariables(pathVariable);
    this.page = this.route.snapshot.url[0].path;
    this.getShowDetails();
  }

  getShowDetails=()=>{
    ///show/budget/pdf?showId={showId}&contactId={contactId} 

    this.callsheetTitle = "Quotation";
    let showId='';
    
    let showDetailByIdAPI = this.httpService.callApi('getShowById', { pathVariable: this.projectId });
    // let getShowContactAPI= this.httpService.callApi('getShowContacts', { pathVariable: this.projectId });
    this.blockedPanel = true;
    forkJoin([showDetailByIdAPI]).subscribe(resultList => {
      this.projectDetail = resultList[0];
      this.contactList=this.projectDetail.recordContacts || [];
      this.blockedPanel = false;
    }, (errorList) => {
      console.log('Error[0] ', errorList[0]);
      // console.log('Error[0] ', errorList[1]);
      this.blockedPanel = false;

    });
  }

  pdfOnClick(id, index) {
  
     if (this.page === "show-budgeting") {
       this.pdfPrintContact[index] = true;
       let newURL = "?showId=" + this.projectId + "&contactId=" + id;
       this.blockedPanel = true;
       this.httpService.callApi('printPDFForShowBudget', { pathVariable: newURL }).subscribe(response => {
         this.fileUrl = response.pdfUrl;
         this.fileCleanUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
          this.blockedPanel = false;
       },
       error=>{
         console.log(error);
        this.blockedPanel = false;
       })
     }
     
 
   }




}
