import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment-timezone';
import { HttpService } from '../core/services/http.service';
import { CommonDataService } from '../core/services/common-data.service';

@Component({
  selector: 'app-personal-schedule-modal',
  templateUrl: './personal-schedule-modal.component.html',
  styleUrls: ['./personal-schedule-modal.component.scss']
})
export class PersonalScheduleModalComponent implements OnInit {

  public functionList:any=[];
  public projectList:any=[];
  public selectedColor: string = '#161514';
  public scheduleForm:any;
  public isUpdate:any;
  public isbookingIdAvailable:boolean=false;

  constructor(public httpService: HttpService,public commonDataService: CommonDataService,public fb: FormBuilder, public dialogRef: MatDialogRef<PersonalScheduleModalComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createForm();
   }

  ngOnInit() {
    // functionList:this.functionList,
    //   projectList:this.projectList
    this.setData();
  }

  createForm=()=>{
    this.scheduleForm=this.fb.group({
      job: [null],
      projectName: [null],
      functionName:[null],
      startDate:[null],
      endDate:[null],
      theme:[null],
      sick:[null]
    });
  }

  setData=()=>{
    this.functionList = this.data.functionList || [];
    this.projectList = this.data.projectList || [];
    if(this.data.update){
      this.isUpdate = this.data.update;
      let startDate=this.data.eventData['start'];
      let endDate=this.data.eventData['end'];
      let theme = this.data.eventData['theme']
      let sick = this.data.eventData['sick']
      let functionName = this.data.eventData.functionName;
      let job = this.data.eventData.text;

      if(this.data.eventData.hasOwnProperty('bookingId')){
        this.isbookingIdAvailable=true;
      }
      else{
        this.isbookingIdAvailable=false;
      }    
      this.scheduleForm.controls.job.setValue(job)
      this.scheduleForm.controls.projectName.setValue(null)
      this.scheduleForm.controls.functionName.setValue(functionName)
      this.scheduleForm.controls.startDate.setValue(new Date(startDate))
      this.scheduleForm.controls.endDate.setValue(new Date(endDate))
      this.scheduleForm.controls.theme.setValue(theme)
      this.scheduleForm.controls.sick.setValue(sick)
    }
  }

  onStartDateSelect=(type: string, event: MatDatepickerInputEvent<Date>)=>{
    console.log(event.value)
  }

  onEndDateSelect=(type: string, event: MatDatepickerInputEvent<Date>)=>{
    console.log(event.value)
  }

  onSave=()=>{
    console.log(this.scheduleForm)

    let jobName= this.scheduleForm.controls.job.value || "";
    let projectName= this.scheduleForm.controls.projectName.value || "";
    let FunctionName= this.scheduleForm.controls.functionName.value || ""

    if(!jobName){
      this.commonDataService.showSnackBar("Job designation is required","warning")
      return;
    }

    if(projectName && !FunctionName){
      this.commonDataService.showSnackBar("Function is required","warning")
      return;
    }

    // moment("1995-12-25 02:30").tz("Asia/Calcutta").format()
    // moment(data.start).tz("Asia/Calcutta").format()
    
    //get all data
    
    let data={
      job: this.scheduleForm.controls.job.value,
      projectName: this.scheduleForm.controls.projectName.value,
      functionName:this.scheduleForm.controls.functionName.value,
      startDate: moment(this.scheduleForm.controls.startDate.value).tz("Asia/Calcutta").format() ,
      endDate: moment(this.scheduleForm.controls.endDate.value).tz("Asia/Calcutta").format(),
      theme:this.scheduleForm.controls.theme.value,
      sick:this.scheduleForm.controls.sick.value
    }
    // 2019-03-04 13:00 
    console.log(data)
    this.createJsonObject(data)
  }

  createJsonObject=(localData)=>{
    let apiData={};
    let userData=this.commonDataService.getLoggedInUserData();
    if(!userData.hasOwnProperty('user_id')){
      return;
    }
    let userId= userData['user_id'];


    if( this.scheduleForm.controls.projectName.value){
      apiData = {
        id: this.data.eventData ? this.data.eventData['id'] : null,
        comment: localData.job,
        start: localData.startDate,
        end: localData.endDate,
        resource: {
          id: userId,
        },
        projectId: localData.projectName,
        function: {
          id: localData.functionName
        },
        createProject: true,
        sick: localData.sick
      };
    }
    else{
      apiData = {
        id:this.data.eventData ? this.data.eventData['id'] : null,
        text: localData.job,
        userStartTime: localData.startDate,
        userEndTime: localData.endDate,
        staffMemberId: userId,
        theme: localData.theme,
        projectId: localData.projectName,
        functionId: localData.functionName,
        createProject: false,
        sick: localData.sick
      };
    }

    
    console.log("apiData",apiData)
    this.callSaveApi(apiData);
  }


  callSaveApi=(userBooking)=>{
    this.httpService.callApi(userBooking.createProject ? 'saveBookingFromUserScheduler' : 'saveOrUpdateUserBooking', { body: userBooking }).subscribe((response) => {
      // response.start = moment(response.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
      // response.end = moment(response.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss");
      // console.log(response)
      this.closeModal(true);
    },(error)=>{
      this.commonDataService.showSnackBar(error.error.message,"error")
    });
  }

  delete() {
    let params = {
      id: this.data.eventData ? this.data.eventData['id'] : null,
      delete: true
    }
    this.deleteUserBooking(params);
  }

  deleteUserBooking(result) {
    this.httpService.callApi('deleteUserBooking', { pathVariable: '/' + result.id }).subscribe((response) => {
      this.commonDataService.showSnackBar("Booking deleted.","success")
      this.closeModal(true)
    }, (error) => {
      this.commonDataService.showSnackBar(error.error.message,"error")
    })
  }



  closeModal=(result)=>{
    this.dialogRef.close(result);
  }




}
