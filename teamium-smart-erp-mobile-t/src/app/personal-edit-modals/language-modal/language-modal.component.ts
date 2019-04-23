import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { CommonDataService } from 'src/app/core/services/common-data.service';
import { HttpService } from 'src/app/core/services/http.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-language-modal',
  templateUrl: './language-modal.component.html',
  styleUrls: ['./language-modal.component.scss']
})
export class LanguageModalComponent implements OnInit {
  public selectedLanguage:any;
  public selectedLanguageList:any=[];
  public languageDropDownList:any=[];
  public initialLanguageDropDownList:any=[];
  constructor(public dialogRef: MatDialogRef<LanguageModalComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public httpService: HttpService,
  public commonDataService: CommonDataService) { }

  ngOnInit() {
    this.modifyList();
  }

  modifyList=()=>{
    this.languageDropDownList = JSON.parse(JSON.stringify(this.data.languageDropDownList));
    this.initialLanguageDropDownList = JSON.parse(JSON.stringify(this.data.languageDropDownList));
    this.selectedLanguageList = JSON.parse(JSON.stringify(this.data.selectedLanguageList)) || [];
    this.updateDropDownList();
  }

  addLanguage=(newLanguage)=>{
    if(!newLanguage){
      return;
    }
    let exist=false;
    if(this.selectedLanguageList.indexOf(newLanguage)>-1){
      exist=true;
    }
    if(!exist){
      this.selectedLanguageList.push(newLanguage);
      this.selectedLanguage=null; 
    }

    this.updateDropDownList();
  }

  removeLanguage=(oldLanguage)=>{
    let index =this.selectedLanguageList.indexOf(oldLanguage);
    if(index>-1){
      this.selectedLanguageList.splice(index,1);
    }
    this.updateDropDownList();
  }

  updateDropDownList=() => {
    this.languageDropDownList = this.initialLanguageDropDownList.filter(element => {
      let exist=false;
      this.selectedLanguageList.forEach(lang => {
        if(element == lang){
          exist=true;
        }
      });
      if(exist==false){
        return true
      }
    });
  }

  onSave=()=>{
    this.createSkillData();
  }

  createSkillData=()=>{
    let profileDetails = this.data.profileDetails;
    let languageList= this.selectedLanguageList || [];
    profileDetails['languages']=languageList;

    profileDetails['fromMobileApp']=true;
    try{
      profileDetails['contractSettingDTO']['dayStart']= this.getContractDates(profileDetails.contractSettingDTO.dayStart) ;//moment();
      profileDetails['contractSettingDTO']['dayEnd']= this.getContractDates(profileDetails.contractSettingDTO.dayEnd) ;//moment();
    }
    catch(ex){
      console.error(ex)
    }
    this.callSaveApi(profileDetails)
    // this.commonDataService.showSpinner();
  }

  callSaveApi=(profileDetails)=>{
    this.commonDataService.showSpinner();
    this.httpService.callApi('saveProfileDetails', { body: profileDetails }).subscribe((responce) => {
      this.commonDataService.hideSpinner();
      this.closeModal(true);
    }, error => {
      this.commonDataService.hideSpinner();
      this.commonDataService.showSnackBar(error.error.message,"error")
      console.error('Error getstatus => ', error)
    });
  }

  getContractDates(obj: any): Date {
    let time = obj.split(":");
    let mydate = new Date();
    mydate.setHours(time[0]);
    mydate.setMinutes(time[1]);
    return mydate;
  }

  closeModal=(result)=>{
    this.dialogRef.close(result);
  }

}
