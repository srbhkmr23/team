import { Component, OnInit } from '@angular/core';
import { getCurrencySymbol } from '@angular/common'
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


@Component({
  selector: 'app-show-projects',
  templateUrl: './show-projects.component.html',
  styleUrls: ['./show-projects.component.scss']
})

export class ShowProjectsComponent implements OnInit {

  showEditProjectModal: boolean = false;
  projectDetail: any;
  showId: number;
  loggedInUser: any;
  addLineForm: FormGroup;
  isEquipmentManager: boolean = false;
  isEditLineModalOpen: boolean = false;
  showAddLineModal: boolean = false;
  dropdownDataAPI: any;
  projectDetailByIdAPI: any;
  dropdownData: any;
  resourceTypes: any = [];
  resourceList: any = [];
  blockedPanel: boolean = false;
  selectedLine: any;
  getCurrencySymbol = getCurrencySymbol;
  extras: any = [];
  rateOnSlectedFunction: any = [];
  manualUpdate: boolean = false;
  editLineForm: FormGroup;
  innerHeight: any;
  removedAttachments: any = [];
  attachments: any = [];
  lineEditHeightStyle: any;
  findProjectByBudgetApi: any;
  bookingExist: any = false;
  showAvailableResources: any = false;
  changedByDueDate: any = true;
  searchBy: string = null;
  canNotEditLine: boolean = false;





  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private toastr: ToastrService, private httpService: HttpService, private commonUtilService: CommonUtilService, private dataService: DataService, private userDetailsService: UserDetailsService) {

  }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);
    this.blockedPanel = true;

    this.route.params.subscribe(params => this.showId = params.id);

    this.projectDetailByIdAPI = this.httpService.callApi('getShowById', { pathVariable: this.showId });


    forkJoin([this.projectDetailByIdAPI]).subscribe(resultList => {
      this.projectDetail = resultList[0];
      let pathVariable: any = new Array();
      pathVariable.push({ "showId": this.showId });
      this.dataService.addPathvariables(pathVariable);
      this.blockedPanel = false;
    }, (errorList) => {
      console.log('Error[0] ', errorList[0]);
      console.log('Error[0] ', errorList[1]);
      this.blockedPanel = false;

    });

  }


  redirectToProject(record: any) {
    let url = '';
    if (record.recordDiscriminator == 'budget') {
      url = "/teamium/project-budgeting/" + record.id;
    } else {
      url = "/teamium/project-booking/" + record.id;
    }

    this.router.navigate([url]);
  }
}
