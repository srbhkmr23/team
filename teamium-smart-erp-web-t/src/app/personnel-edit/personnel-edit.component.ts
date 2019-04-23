import { Component, OnInit } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { CommonUtilService } from '../core/services/common-util-service';
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from '../core/services/data.service';
import { UserDetailsService } from '../core/services/user-details.service';

@Component({
  selector: 'app-personnel-edit',
  templateUrl: './personnel-edit.component.html',
  styleUrls: ['./personnel-edit.component.scss']
})
export class PersonnelEditComponent implements OnInit {

  personnelDetail: any;
  personnelId: number;
  primaryFunction: any;
  functions : any;
  showSavePersonnelModal: boolean = false;
  primaryEmail: any;
  emails: any;
  primaryTelephone: any;
  telephones: any;
  secondaryEmail: any;
  secondaryTelephone: any;
  blockedPanel=false;
  isHumanResource: boolean = false;
  recentBookings : any;

  constructor(private router:Router,private route: ActivatedRoute, private httpService: HttpService, private commonUtilService: CommonUtilService, private dataService: DataService,
   private userDetailsService: UserDetailsService) {
    this.route.params.subscribe(params => this.personnelId = params.id);
  }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);
    this.route.params.subscribe(params => this.personnelId = params.id);
    let pathVariable: any = new Array();
    // pathVariable.push(this.personnelId);
    pathVariable.push({ "staffId":this.personnelId});
    this.dataService.addPathvariables(pathVariable);
    this.getPersonnelDetailById();
    this.userDetailsService.isValidateUserRoleForModule('Human Resources', (res) => {
      this.isHumanResource = res;
    });
  }

  getPersonnelDetailById() {
    this.httpService.callApi('getPersonnelById', { pathVariable: this.personnelId }).subscribe(response => {
      this.personnelDetail = response;
      this.recentBookings = this.personnelDetail.recentBooking;
      this.primaryFunction = this.getPrimaryFunction();
      this.primaryEmail = this.getPrimaryEmail();
      this.primaryTelephone = this.getPrimaryTelephones();

    }, error => {
      
      console.log(error);
    });
  }

  getDaydiff(date: Date) {
    console.log(this.commonUtilService.getDayDiffBetweenTwoDays(new Date(), new Date(date)))
    this.commonUtilService.getDayDiffBetweenTwoDays(new Date(), new Date(date));
  }

  // getMainFunction() :any{
  //   if (this.personnelDetail.resource != null && this.personnelDetail.resource.functions) {
  //     this.functions = this.personnelDetail.resource.functions.sort((item1, item2) => {
  //       if( (item1.rating==null && item2.rating == null) ||item1.rating == item2.rating){
  //         //Compare on the bases of date and get the first created resource-function
  //         return item1.createdOn > item2.createdOn ? 1 : -1;
  //       }
  //       //getting max rating
  //       return item1.rating > item2.rating ? -1 : 1;
  //     });
  //     return this.functions[0];
  //   }
  // }

  getPrimaryFunction(): any {
    if (this.personnelDetail.resource != null && this.personnelDetail.resource.functions) {
      this.functions = this.personnelDetail.resource.functions.filter(resFunction => resFunction.primaryFunction == true);
      return this.functions[0];
    }
  }



   /*-To close create-equipment component and refresh it. -*/
   closeModal($event) {
    this.showSavePersonnelModal = $event;
    this.ngOnInit();
   }


  getPrimaryEmail(): any {

    if (this.personnelDetail.userSettingDTO != null && this.personnelDetail.userSettingDTO.emails) {
      this.emails = this.personnelDetail.userSettingDTO.emails.filter(email => email.primaryEmail == true);
      this.secondaryEmail = this.personnelDetail.userSettingDTO.emails.filter(email => email.primaryEmail == false)[0];
      return this.emails[0];
    }

  }

  getPrimaryTelephones(): any {
    if (this.personnelDetail.userSettingDTO != null && this.personnelDetail.userSettingDTO.telephones) {
      this.telephones = this.personnelDetail.userSettingDTO.telephones.filter(tel => tel.primaryTelephone == true);
      this.secondaryTelephone = this.personnelDetail.userSettingDTO.telephones.filter(tel => tel.primaryTelephone == false)[0];
      return this.telephones[0];
    }
  }

  

}
