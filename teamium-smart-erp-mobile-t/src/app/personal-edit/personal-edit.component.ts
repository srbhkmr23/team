import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { HttpService } from '../core/services/http.service';
import {MatDialog} from '@angular/material';
import { CommonDataService } from '../core/services/common-data.service';
import {FunctionModalComponent} from '../personal-edit-modals/function-modal/function-modal.component';
import { SkillsModalComponent } from '../personal-edit-modals/skills-modal/skills-modal.component';
import { LanguageModalComponent } from '../personal-edit-modals/language-modal/language-modal.component';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-personal-edit',
  templateUrl: './personal-edit.component.html',
  styleUrls: ['./personal-edit.component.scss']
})
export class PersonalEditComponent implements OnInit {

  profileDetails:any={};
  functions:any=[];
  skills:any=[];
  languages:any=[];
  groups:any=[];
  isFreelancer:boolean=false;
  dropDownData:any={};
  userName:string = "";
  profilePicUrl:string = "";
  primaryFunction:string ="";

  constructor(public httpService: HttpService,public commonDataService: CommonDataService,public dialog: MatDialog,public _location: Location, public router: Router) { 
    
  }

  ngOnInit() {
    this.commonDataService.setActivePage('');
    this.getProfileDetails();
    // this.getDropdownData();
  }

  getProfileDetails=()=>{
    let userData=this.commonDataService.getLoggedInUserData();
    if(!userData.hasOwnProperty('user_id')){
      return;
    }
    let userId = userData['user_id'];
    this.userName =  userData['fullName'] || "";
    this.profilePicUrl=userData['profileUrl'] || "";
    
    let profileDetailsApi = this.httpService.callApi('getProfileDetails', {pathVariable:"/"+userId});
    let DropdownApi = this.httpService.callApi('getStaffDropdownData', {});

    this.commonDataService.showSpinner();
    forkJoin([profileDetailsApi,DropdownApi]).subscribe((responce) => {
      this.commonDataService.hideSpinner();
      this.profileDetails=responce[0] || {};
      this.dropDownData=responce[1] || {};
      this.setData(this.profileDetails);

    }, 
    (error) => {
        this.commonDataService.hideSpinner();
        console.error('Error getstatus => ', error)
    })

    // this.httpService.callApi('getProfileDetails', {pathVariable:"/"+userId}).subscribe((responce) => {
    //   this.commonDataService.hideSpinner();
    //   this.profileDetails=responce || {};
    //   this.setData(this.profileDetails);
    // }, error => {
    //   this.commonDataService.hideSpinner();
    //   console.error('Error getstatus => ', error)
    // });
  }

  

  setData=(profileDetails)=>{
    this.functions = profileDetails.resource && profileDetails.resource.functions? profileDetails.resource.functions : [];
    this.skills = profileDetails.skills || [];
    this.languages = profileDetails.languages ||  [];
    this.groups = profileDetails.groupDTOs || [];
    this.isFreelancer = profileDetails.freelance;

    this.getPrimaryFunction(this.functions)
  }

  getPrimaryFunction = (functions) =>{
    console.log("functions",functions);
    this.primaryFunction="";
    try{
      functions.forEach(element => {
        if(element.primaryFunction){
          this.primaryFunction = element['function'] ? element['function'].value : "";
        }
      });
    }
    catch(ex){
      console.error(ex)
      this.primaryFunction="";
    }
  }

  getDropdownData=()=>{
    this.commonDataService.showSpinner();
    this.httpService.callApi('getStaffDropdownData', {}).subscribe((responce) => {
      this.commonDataService.hideSpinner();
      this.dropDownData=responce || {};
    }, error => {
      this.commonDataService.hideSpinner();
      console.error('Error getstatus => ', error)
    });
  }
  
  openFunctionDialog(): void {
    let functionDropDownList = this.dropDownData['functions'] || [];
    const dialogRef = this.dialog.open(FunctionModalComponent, {
      data:{functionDropDownList:functionDropDownList,
        selectedFunctionList:this.functions,
        profileDetails:this.profileDetails
      },
      panelClass:"common-modal-view",
      maxWidth:"250px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result==true){
        this.getProfileDetails();
      }
    });
  }

  openSkillsDialog(): void {
    let skillDropDownList = this.dropDownData['skills'] || [];
    const dialogRef = this.dialog.open(SkillsModalComponent, {
      data:{skillDropDownList:skillDropDownList,
        selectedSkillList:this.skills,
        profileDetails:this.profileDetails
      },
      panelClass:"common-modal-view",
      maxWidth:"250px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result==true) {
        this.getProfileDetails();
      }
    });
  }

  openLanguageDialog(): void {
    let languageDropDownList = this.dropDownData['languages'] || [];
    const dialogRef = this.dialog.open(LanguageModalComponent, {
      data:{languageDropDownList:languageDropDownList,
        selectedLanguageList:this.languages,
        profileDetails:this.profileDetails
      },
      panelClass:"common-modal-view",
      maxWidth:"250px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result==true) {
        this.getProfileDetails();
      }
    });
  }

  onChangeFreelancer=(isFreelancer)=>{
    this.createFreelancerData(isFreelancer)
  }

  createFreelancerData=(isFreelancer)=>{
    let profileDetails = this.profileDetails;
    profileDetails['freelance']=isFreelancer;
    this.callSaveApi(profileDetails)
  }

  callSaveApi=(profileDetails)=>{
    this.commonDataService.showSpinner();
    this.httpService.callApi('saveProfileDetails', { body: profileDetails }).subscribe((responce) => {
      this.commonDataService.hideSpinner();
      this.getProfileDetails();
    }, error => {
      this.commonDataService.hideSpinner();
      console.error('Error getstatus => ', error)
    });
  }

  getLanguagesString=(languages)=>{
    try {
      return languages.join(', ')
    }
    catch(ex){
      console.error(ex);
      return "";
    }
  }

  getGroupString = (groups) =>{
    try {
      let arr = [];
      groups.forEach(element => {
        arr.push(element.name)
      });

      return arr.join(', ')
    }
    catch(ex){
      console.error(ex);
      return "";
    }
  }

  goBack=()=>{
    this._location.back();
    // let lastActivePage = this.commonDataService.getLastActivePage();
    // this.router.navigate([lastActivePage]);
  }

}
