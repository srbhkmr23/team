import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HttpService } from 'src/app/core/services/http.service';
import { CommonDataService } from 'src/app/core/services/common-data.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-skills-modal',
  templateUrl: './skills-modal.component.html',
  styleUrls: ['./skills-modal.component.scss']
})
export class SkillsModalComponent implements OnInit {
  public selectedSkill:any;
  public selectedSkillList:any=[];
  public skillDropDownList:any=[];
  public initialSkillDropDownList:any=[];
  constructor(public dialogRef: MatDialogRef<SkillsModalComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public httpService: HttpService,
  public commonDataService: CommonDataService) { }

  ngOnInit() {
    // console.log(this.data.skillDropDownList)
    this.modifyList();
  }
  
  modifyList=()=>{
    this.skillDropDownList = JSON.parse(JSON.stringify(this.data.skillDropDownList));
    this.initialSkillDropDownList =  JSON.parse(JSON.stringify(this.data.skillDropDownList));

    let list = this.data.selectedSkillList || [];
    list = list.map(item=>{
    if(item.hasOwnProperty('domain')){
      // item['value']=item.function['value'];
      // item['qualifiedName']=item.function['qualifiedName'];
      item = item.domain;
    }
      return item;
    })
    this.selectedSkillList = list;
    // console.log("selectedSkillList",this.selectedSkillList)
    this.updateDropDownList();
  }

  addSkill=(newSkill)=>{
    if(!newSkill){
      return;
    }
    let exist=false;
    this.selectedSkillList.forEach(item => {
      if(item == newSkill){
        exist=true;
      }
    });
    if(!exist){
      this.selectedSkillList.push(newSkill);
      this.selectedSkill=null;
    }
    this.updateDropDownList();
  }

  removeSkill=(oldSkill)=>{
    this.selectedSkillList.forEach((item,index) => {
      if(item == oldSkill){
        this.selectedSkillList.splice(index,1);
      }
    });
    this.updateDropDownList();
  }

  updateDropDownList=() => {
    this.skillDropDownList = this.initialSkillDropDownList.filter(element => {
      let exist=false;
      this.selectedSkillList.forEach(skill => {
        if(element == skill){
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
    let skillList=[];
    let oldSkillList=profileDetails['skills'] || [];
    this.selectedSkillList.forEach(item => {
      let exist=false;
      oldSkillList.forEach(element => {
        if(item==element['domain']){
          exist=true;
          skillList.push(element)
        }
      });

      if(exist==false){
        let skillObj={};
        skillObj={
          'domain':item,
          'rating':null
        }
        skillList.push(skillObj)
      }
    });
    // if(resourceList.length==1){
    //   resourceList[0]['primaryFunction']=true;
    // }
    profileDetails['skills']=skillList;
    // profileDetails['contractSettingDTO']=null
    profileDetails['fromMobileApp']=true;
    try{
      profileDetails['contractSettingDTO']['dayStart']= this.getContractDates(profileDetails.contractSettingDTO.dayStart) ;//moment();
      profileDetails['contractSettingDTO']['dayEnd']= this.getContractDates(profileDetails.contractSettingDTO.dayEnd) ;//moment();
    }
    catch(ex){
      console.error(ex)
    }
    this.callSaveApi(profileDetails)
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
