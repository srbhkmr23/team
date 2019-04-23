import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { createPipeInstance } from '@angular/core/src/view/provider';
import { HttpService } from 'src/app/core/services/http.service';
import { CommonDataService } from 'src/app/core/services/common-data.service';
import * as moment from 'moment-timezone';
@Component({
  selector: 'app-function-modal',
  templateUrl: './function-modal.component.html',
  styleUrls: ['./function-modal.component.scss']
})
export class FunctionModalComponent implements OnInit {
  public selectedFunction:any;
  public selectedFunctionList:any=[];
  public functionDropDownList:any=[];
  public initialFunctionDropDownList:any=[];
  constructor(public dialogRef: MatDialogRef<FunctionModalComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any, 
  public httpService: HttpService,
  public commonDataService: CommonDataService) {
  }
  ngOnInit() { 
    this.modifyList();
  }

  modifyList=()=>{
    this.functionDropDownList = JSON.parse(JSON.stringify(this.data.functionDropDownList));
    this.initialFunctionDropDownList =  JSON.parse(JSON.stringify(this.data.functionDropDownList));

    let list = this.data.selectedFunctionList || [];
    list = list.map(item=>{
    if(item.hasOwnProperty('function')){
      // item['value']=item.function['value'];
      // item['qualifiedName']=item.function['qualifiedName'];
      item = item.function;
    }
      return item;
    })
    this.selectedFunctionList = list;
    this.updateDropDownList();
  }

  updateDropDownList=() => {
    this.functionDropDownList = this.initialFunctionDropDownList.filter(element => {
      let exist=false;
      this.selectedFunctionList.forEach(fun => {
        if(element.id == fun.id){
          exist=true;
        }
      });
      if(exist==false){
        return true
      }
    });
  }

  addFunction=(newFunction)=>{
    if(!newFunction){
      return;
    }
    let exist=false;
    this.selectedFunctionList.forEach(item => {
      if(item['id'] == newFunction.id){
        exist=true;
      }
    });

    if(!exist){
      this.selectedFunctionList.push(newFunction);
      this.selectedFunction=null
    }
    this.updateDropDownList();
  }

  removeFunction=(oldFunction)=>{
    this.selectedFunctionList.forEach((item,index) => {
      if(item['id'] == oldFunction.id){
        this.selectedFunctionList.splice(index,1);
      }
    });
    this.updateDropDownList();
  }

  onSave=()=>{
    this.createFunctionResource();
  }

  createFunctionResource=()=>{
    let profileDetails = this.data.profileDetails;
    // profileDetails['contractSettingDTO']={
    //   contractId: profileDetails['contractSettingDTO'].id
    // };
    
    let resourceList=[];
    let oldResourceList=profileDetails['resource']['functions'];
    this.selectedFunctionList.forEach(item => {
      let exist=false;
      oldResourceList.forEach(element => {
        if(item.id==element['function'].id){
          exist=true;
          resourceList.push(element)
        }
      });

      if(exist==false){
        let functionObj={};
        functionObj={
          'function':item,
          'primaryFunction':false,
          'rating':null
        }
        resourceList.push(functionObj)
      }
    });
    if(resourceList.length==1){
      resourceList[0]['primaryFunction']=true;
    }
    profileDetails['resource']['functions']=resourceList;
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
