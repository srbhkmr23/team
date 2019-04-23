import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-save-labour-rule',
  templateUrl: './save-labour-rule.component.html',
  styleUrls: ['./save-labour-rule.component.scss']
})
export class SaveLabourRuleComponent implements OnInit {
  @Input() componentName='Labour Agreement';
  @Input() selectedLabourRule: any;
  @Input() staffList: any;
  @Output() closeModalEvent = new EventEmitter<boolean>();

  blockedPanel: boolean = false;
  settingsForm: any;
  holidaysForm: any;
  approvalForm: any;
  activeTab: string = "settings"
  holidayList: any = [];
  approvalList: any = [];
  holidayEditObject = {};
  modalText: string = '';
  showDeleteModal:boolean=false;
  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) { }

  ngOnInit() {
    this.settingsForm = this.createSettingForm();
    this.holidaysForm = this.createHolidaysForm();
    this.approvalForm = this.createApprovalForm();
    this.setLabourRuleFormData();
    this.setHolidayFormData();
    this.setApprovalFormData();

    this.modalText = "Create Labour Agreement";
    if (this.selectedLabourRule.hasOwnProperty('labourRuleId')) {
      this.modalText = "Edit Labour Agreement";
    }
  }

  createSettingForm = () => {

    return this.formBuilder.group({
      labourAgreementName: [null],
      overTime1to4: [null],
      overTime5to8: [null],
      overTime9toMore: [null],
      nightHours: [null],
      sundayHours: [null],
      holidayHours: [null],
      specialHolidayHours: [null],
      lunchBreak: [null],
      workingHourPerDay: [null],
      maximumWorkingHourPerDay: [null],
      averageWeeklyHours: [null],
      maximumWeeklyHours: [null],
      maximumMonthlyHours: [null],
      restTimeBetweenBooking: [null],
      // morningStartTime:[null],
      // morningEndTime:[null],
      nightStartTime: [null],
      nightEndTime: [null],
      maximumFreelanceWorkingDays: [null],
      maximumExtraHourPerAnnumDay: [null],
      distanceToProduction: [null],
      travelTimePeriod: [null]

    });
  }

  createHolidaysForm = () => {
    return this.formBuilder.group({
      holidayName: [null],
      holidayDate: [new Date()]

    });
  }

  createApprovalForm = () => {
    return this.formBuilder.group({
      selectedStaff: [null]
    });
  }

  setLabourRuleFormData = () => {
    let selectedRule = this.selectedLabourRule;
    let settingForm = this.settingsForm;

    // let morningStartTime = this.convertTimeStringToDate(selectedRule.morningStartTime)
    // let morningEndTime = this.convertTimeStringToDate(selectedRule.morningEndTime)

    let nightStartTime = this.convertTimeStringToDate(selectedRule.nightStartTime)
    let nightEndTime = this.convertTimeStringToDate(selectedRule.nightEndTime)

    if (selectedRule && selectedRule.hasOwnProperty('labourRuleId')) {
      settingForm.get("labourAgreementName").setValue(selectedRule.labourRuleName)
      settingForm.get("overTime1to4").setValue(selectedRule.overTimeChargesFor1to4Hour)
      settingForm.get("overTime5to8").setValue(selectedRule.overTimeChargesFor5to8Hour)
      settingForm.get("overTime9toMore").setValue(selectedRule.overTimeChargesFor9toAboveHour)
      settingForm.get("nightHours").setValue(selectedRule.nightHourChargesPercentage)
      settingForm.get("sundayHours").setValue(selectedRule.sundayHourChargesPercentage)
      settingForm.get("holidayHours").setValue(selectedRule.holidayHourChargesPercentage)
      settingForm.get("specialHolidayHours").setValue(selectedRule.specialHolidayHourChargesPercentage)
      settingForm.get("lunchBreak").setValue(selectedRule.lunchDuration)
      settingForm.get("workingHourPerDay").setValue(selectedRule.workingDuration)
      settingForm.get("maximumWorkingHourPerDay").setValue(selectedRule.maximumWorkingDuration)
      settingForm.get("averageWeeklyHours").setValue(selectedRule.averageWeeklyDuration)
      settingForm.get("maximumWeeklyHours").setValue(selectedRule.maximumWeeklyDuration)
      settingForm.get("maximumMonthlyHours").setValue(selectedRule.workingDurationPerMonth)
      settingForm.get("restTimeBetweenBooking").setValue(selectedRule.restDurationBetweenBookings)
      // settingForm.get("morningStartTime").setValue(morningStartTime)
      // settingForm.get("morningEndTime").setValue(morningEndTime)
      settingForm.get("nightStartTime").setValue(nightStartTime)
      settingForm.get("nightEndTime").setValue(nightEndTime)
      settingForm.get("maximumFreelanceWorkingDays").setValue(selectedRule.maximumFreelancerWorkingDay)
      settingForm.get("maximumExtraHourPerAnnumDay").setValue(selectedRule.workingDayPerYear)
      settingForm.get("distanceToProduction").setValue(selectedRule.distanceToProduction)
      settingForm.get("travelTimePeriod").setValue(selectedRule.travelTimePeriod)
    }
    else {
      settingForm.reset();
      // settingForm.get("nightStartTime").setValue(this.convertTimeStringToDate("22:15:00"))
    }

  }

  setHolidayFormData = () => {
    let selectedRule = this.selectedLabourRule;
    let holidaysForm = this.holidaysForm;

    if (selectedRule && selectedRule.hasOwnProperty('labourRuleId')) {
      this.holidayList = selectedRule.holidayDTOs || [];
      this.addnewFieldInHolidayArray()
    }
    else {
      holidaysForm.reset();
      holidaysForm.get("holidayDate").setValue(new Date())
    }

  }

  setApprovalFormData = () => {
    let selectedRule = this.selectedLabourRule;
    let approvalForm = this.approvalForm;

    if (selectedRule && selectedRule.hasOwnProperty('labourRuleId')) {
      this.approvalList = selectedRule.staffMemberDTOs || [];
    }
    else {
      approvalForm.reset();
    }
  }

  saveLabourRuleSettings = () => {

    let settingForm = this.settingsForm;

    let name = settingForm.get("labourAgreementName").value;


    if(name==undefined || name == null || name==""){
      this.toastr.error("Labour rule name can not be empty.", 'Labour Agreement');
      return;
    }

    let settingObject = {
      "labourRuleName": settingForm.get("labourAgreementName").value,
      // "morningStartTime": this.convertInTimeFormat(settingForm.get("morningStartTime").value),
      // "morningEndTime": this.convertInTimeFormat(settingForm.get("morningEndTime").value),
      "nightStartTime": this.convertInTimeFormat(settingForm.get("nightStartTime").value) || null,
      "nightEndTime": this.convertInTimeFormat(settingForm.get("nightEndTime").value) || null,
      "workingDuration": settingForm.get("workingHourPerDay").value,
      "maximumWorkingDuration": settingForm.get("maximumWorkingHourPerDay").value,
      "workingDurationPerMonth": settingForm.get("maximumMonthlyHours").value,
      "workingDayPerYear": settingForm.get("maximumExtraHourPerAnnumDay").value,
      "lunchDuration": settingForm.get("lunchBreak").value,
      "restDurationBetweenBookings": settingForm.get("restTimeBetweenBooking").value,
      "extraHourChargesPercentage": null,
      "nightHourChargesPercentage": settingForm.get("nightHours").value,
      "sundayHourChargesPercentage": settingForm.get("sundayHours").value,
      "holidayHourChargesPercentage": settingForm.get("holidayHours").value,
      "specialHolidayHourChargesPercentage": settingForm.get("specialHolidayHours").value,
      "overTimeChargesFor1to4Hour": parseInt(settingForm.get("overTime1to4").value),
      "overTimeChargesFor5to8Hour": settingForm.get("overTime5to8").value,
      "overTimeChargesFor9toAboveHour": settingForm.get("overTime9toMore").value,
      "maximumWeeklyDuration": settingForm.get("maximumWeeklyHours").value,
      "averageWeeklyDuration": settingForm.get("averageWeeklyHours").value,
      "maximumFreelancerWorkingDay": settingForm.get("maximumFreelanceWorkingDays").value,
      "distanceToProduction": settingForm.get("distanceToProduction").value,
      "travelTimePeriod": settingForm.get("travelTimePeriod").value,
    };

    let selectedRule = this.selectedLabourRule;
    if (selectedRule && selectedRule.hasOwnProperty('labourRuleId')) {
      settingObject['labourRuleId'] = selectedRule.labourRuleId
    }


    this.blockedPanel = true;
    this.httpService.callApi('saveLabourRule', { body: settingObject }).subscribe((response) => {
      this.blockedPanel = false;
      this.selectedLabourRule = response;
      this.toastr.success("Successfully Saved", 'Labour Agreement');
      this.hideLabourAgreementModal();
    }, error => {

      this.blockedPanel=false;      
      this.toastr.error(error.error.message, 'Labour Agreement');
      console.log('Error getstatus => ', error)
    });

  }

  saveLabourRuleHolidays = () => {
    let selectedRule = this.selectedLabourRule;
    if (selectedRule && selectedRule.hasOwnProperty('labourRuleId')) {

      let laborRuleId = selectedRule.labourRuleId;
      let holidayName = this.holidaysForm.get('holidayName').value;
      let holidayDate = moment(this.holidaysForm.get('holidayDate').value).tz("Asia/Calcutta").format();
      let holidayObject = { laborRuleId, holidayName, holidayDate };

      console.log("holidayObject", holidayObject);


      if (holidayName == undefined || holidayName == null || holidayName == "") {
        this.toastr.error("Holiday name can not be empty.", 'Holidays');
        return;
      }

      this.blockedPanel = true;
      this.httpService.callApi('saveLabourRuleHoliday', { body: holidayObject }).subscribe((response) => {
        this.blockedPanel = false;
        this.selectedLabourRule['holidayDTOs'] = response;
        this.holidayList = this.selectedLabourRule['holidayDTOs'] || [];
        this.addnewFieldInHolidayArray()
        this.holidaysForm.reset();
        this.holidaysForm.get("holidayDate").setValue(new Date())
        this.toastr.success("Holiday Successfully Saved", 'Labour Agreement');
      }, error => {
        this.blockedPanel=false;      
        this.toastr.error(error.error.message, 'Labour Agreement');
        console.log('Error getstatus => ', error)
      });

    }
  }


  saveLabourRuleApproval = () => {
    let selectedRule = this.selectedLabourRule;
    let selectedStaff = this.approvalForm.get('selectedStaff').value;
    if(selectedStaff== undefined || selectedStaff == null){
      this.toastr.error("Please select staff", 'Labour Agreement');
    }
    if (selectedRule && selectedRule.hasOwnProperty('labourRuleId') && selectedStaff) {
      let laborRuleId = selectedRule.labourRuleId;
      let pathVariable = laborRuleId + "/" + selectedStaff
      this.blockedPanel = true;
      this.httpService.callApi('saveLabourRuleStaff', { pathVariable: pathVariable }).subscribe((response) => {
        this.blockedPanel = false;
        this.selectedLabourRule['staffMemberDTOs'] = response;
        this.approvalList = this.selectedLabourRule['staffMemberDTOs'] || [];
        this.approvalForm.reset();
        this.toastr.success("Staff Successfully Saved", 'Labour Agreement');
      }, error => {
        this.blockedPanel=false;      
        this.toastr.error(error.error.message, 'Labour Agreement');
        console.log('Error getstatus => ', error)
      });
    }

  }

  deleteLabourRuleSettings = ($event) => {
    if ($event) {
      let selectedLabourRule = this.selectedLabourRule;
      if(selectedLabourRule && selectedLabourRule.hasOwnProperty('labourRuleId')){
       let id = selectedLabourRule.labourRuleId;
       let pathVariable = "/"+id;
       this.blockedPanel=true;
       this.httpService.callApi('deleteLabourRule', { pathVariable: pathVariable }).subscribe((response) => {
          this.blockedPanel=false;
          this.toastr.success("Successfully Deleted", 'Labour Agreement');
          this.closeModalEvent.emit(false);
        }, 
        error => {
          this.blockedPanel=false;
          this.toastr.error(error.error.message, 'Labour Agreement');
          console.log('Error getstatus => ', error)
        });
      }
    }
  }
  closeDeleteConfirmModal($event){
    this.showDeleteModal=$event;
  }

  deleteHoliday = (holiday) => {
    ///holiday/{labour}/{holiday}

    try {
      let holidayId = holiday.id;
      let selectedRule = this.selectedLabourRule;
      if (selectedRule && selectedRule.hasOwnProperty('labourRuleId')) {
        let laborRuleId = selectedRule.labourRuleId;
        let pathVariable = "";
        pathVariable = laborRuleId + "/" + holidayId;
        this.blockedPanel = true;
        this.httpService.callApi('deleteLabourRuleHoliday', { pathVariable: pathVariable }).subscribe((response) => {
          this.blockedPanel = false;

          let newDTO = [];
          newDTO = this.selectedLabourRule['holidayDTOs'].filter(holidayData => {
            if (holidayData.id != holidayId) {
              return holidayData;
            }
          })
          this.selectedLabourRule['holidayDTOs'] = newDTO;
          this.holidayList = this.selectedLabourRule['holidayDTOs'] || [];
          this.addnewFieldInHolidayArray();
          this.toastr.success("Holiday Successfully Deleted", 'Labour Agreement');
          
        }, error => {
          this.blockedPanel=false;      
          this.toastr.error(error.error.message, 'Labour Agreement');
          console.log('Error getstatus => ', error)
        });
      }
    }
    catch (err) {
      console.log(err)
    }
  }


  updateLabourRuleHolidays = (holidayObj) => {

    let holiday = JSON.parse(JSON.stringify(holidayObj))
    let selectedRule = this.selectedLabourRule;
    if (selectedRule && selectedRule.hasOwnProperty('labourRuleId')) {

      let laborRuleId = selectedRule.labourRuleId;
      let holidayName = holiday.newNameValue;//this.holidaysForm.get('holidayName').value;
      let holidayDate = moment(holiday.newDateValue).tz("Asia/Calcutta").format();
      let id = holiday.id;
      let holidayObject = { laborRuleId, id, holidayName, holidayDate };
      if (holidayName == undefined || holidayName == null || holidayName == "") {
        this.toastr.error("Holiday name can not be empty.", 'Holiday');
        return;
      }

      this.blockedPanel = true;
      this.httpService.callApi('saveLabourRuleHoliday', { body: holidayObject }).subscribe((response) => {
        this.blockedPanel = false;
        this.selectedLabourRule['holidayDTOs'] = response;
        this.holidayList = this.selectedLabourRule['holidayDTOs'] || [];
        this.addnewFieldInHolidayArray()
        this.holidaysForm.reset();
        this.holidaysForm.get("holidayDate").setValue(new Date())

        this.toastr.success("Holiday Successfully Saved", 'Labour Agreement');
        this.holidayEditObject[holiday.id]= false;
      }, error => {
        this.blockedPanel=false;      
        this.toastr.error(error.error.message, 'Labour Agreement');
        console.log('Error getstatus => ', error)
      });

    }

  }

  cancelUpdate(holiday) {
    try {
      holiday.newNameValue = holiday.holidayName;
      holiday.newDateValue = holiday.holidayDate;
      this.holidayEditObject[holiday.id] = false;
    }
    catch (err) {
      console.log(err)
    }
  }

  deleteStaff = (staff) => {
    try {
      let staffId = staff.id;
      let selectedRule = this.selectedLabourRule;
      if (selectedRule && selectedRule.hasOwnProperty('labourRuleId')) {
        let laborRuleId = selectedRule.labourRuleId;
        let pathVariable = "";
        pathVariable = laborRuleId + "/" + staffId;
        this.blockedPanel = true;
        this.httpService.callApi('deleteLabourRuleStaff', { pathVariable: pathVariable }).subscribe((response) => {
          this.blockedPanel = false;
          let newDTO = [];
          newDTO = this.selectedLabourRule['staffMemberDTOs'].filter(staffData => {
            if (staffData.id != staffId) {
              return staffData;
            }
          })
          this.selectedLabourRule['staffMemberDTOs'] = newDTO;
          this.approvalList =this.selectedLabourRule['staffMemberDTOs'] || [];
          this.toastr.success("Staff Successfully Deleted", 'Labour Agreement');
        
        }, error => {
          this.blockedPanel=false;      
          this.toastr.error(error.error.message, 'Labour Agreement');
          console.log('Error getstatus => ', error)
        });
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  convertInTimeFormat = (dateTime) => {
    let formatedTime = moment(dateTime).tz("Asia/Calcutta").format();
    if (formatedTime == "Invalid date")
      return null;
    else
      return formatedTime;
  }


  convertTimeStringToDate = (time) => {
    // return moment(time, "hh:mm:ss").tz("Asia/Calcutta").toDate();
    if (time == undefined)
      return null;

    return moment.utc(time).tz("Asia/Calcutta").toDate();
  }

  convertDateStringToDate = (date) => {
    // return moment.utc(date,"DD/MM/YYYY").tz("Asia/Calcutta").format("MM/DD/YYYY");
    var gmtDateTime = moment.utc(date)
    var local = gmtDateTime.tz("Asia/Calcutta").format('DD/MM/YYYY');
    return local;
  }


  // function toTimeZone(time, zone) {
  //   var format = 'YYYY/MM/DD HH:mm:ss ZZ';
  //   return moment(time, format).tz(zone).format(format);
  // }


  addnewFieldInHolidayArray() {
    this.holidayList = this.holidayList.map(data => {
      data['newDateValue'] = new Date(data.holidayDate);
      data['newNameValue'] = data.holidayName;
      return data;
    })
  }

  retuenJSDate = (date) => {
    console.log("new Date(date)=>", moment(date))
    return moment(date);
  }

  onChangeHolidayDate(value) {
    console.log(value)
  }


  hideLabourAgreementModal() {
    this.closeModalEvent.emit(false);
  }
}
