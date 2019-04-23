import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '../../../node_modules/@angular/forms';
import { HttpService } from '../core/services/http.service';
import { DataService } from '../core/services/data.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ToastrService } from '../../../node_modules/ngx-toastr';
import * as moment from 'moment-timezone';
import { DayPilot } from 'daypilot-pro-angular';
import { LeaveRequestComponent } from '../leave-request/leave-request.component';
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  expensesReportForm: any;
  timeSheet: any = [];
  expensesReports: any = [];
  showExpensesReportModal: boolean;
  projectsForPersonalExpenses: any = [];
  selectedExpensesReport: any;
  projectAlreadyInUsed: boolean = false;
  getExpensesReportByStaffMemberIdAPI: any;
  getBookingsByLoggedInGroupsAPI: any;
  invalidNameExist: boolean;
  userBookingsByGroups: any = [];
  blockedPanel: boolean = false;
  loggedInUserBookings: any = [];
  getBookingsByLoggedInUserAPI: any = [];
  userLeaveRecordDTO: any;
  searchTextForExpenses: any;
  searchText: string = "";
  @ViewChild("leaveRequest") leaveRequest;
  searchTextGroupBooking:string='';
  searchTextMyBookings:string='';
  searchSignatureText:string='';
  showOrderEditModal:boolean=false;
  showPrintButton: boolean = true;
  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private dataService: DataService, private router: Router, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.blockedPanel = true;
    this.dataService.checkSubmenu(this.router);
    let weeklyDurationAPI = this.httpService.callApi('findWeeklyWorkingDuration', { pathVariable: "/" + sessionStorage.getItem('userId') });
    this.getExpensesReportByStaffMemberIdAPI = this.httpService.callApi('getExpensesReportByStaffMemberId', { pathVariable: "/" + sessionStorage.getItem('userId') });
    this.getBookingsByLoggedInGroupsAPI = this.httpService.callApi('getBookingsByLoggedInGroups', {});
    this.getBookingsByLoggedInUserAPI = this.httpService.callApi('getBookingsByLoggedInUser', {});
    let userLeaveDetailsAPI = this.httpService.callApi('findUserLeaveRecordByStaffId', { pathVariable: "/" + sessionStorage.getItem('userId') });



    forkJoin([weeklyDurationAPI, this.getExpensesReportByStaffMemberIdAPI, this.getBookingsByLoggedInGroupsAPI, this.getBookingsByLoggedInUserAPI, userLeaveDetailsAPI]).subscribe((responseList) => {
      this.timeSheet = responseList[0];
      this.expensesReports = responseList[1];
      this.userBookingsByGroups = responseList[2];
      this.loggedInUserBookings = responseList[3];
      this.timeSheet.forEach(element => {
        element.duration = this.formatDuration(element.totalDuration)
      });
      this.blockedPanel = false;
      // this.blockedPanel = false;
      this.setUserLeaveRecord(responseList[4]);
    }, (errorList) => {
      console.log('errorList => ', errorList)
      this.blockedPanel = false;
    });
    this.httpService.callApi('getProjectsForExpensesReport', { pathVariable: parseInt(sessionStorage.getItem('userId')) }).subscribe(response => {
      this.projectsForPersonalExpenses = response;
    }, error => {
      // this.toastr.error(error.error.message)
      console.log(error.error.message)
    });
    this.expensesReportForm = this.createFormGroup(null);

    // initialize stream on units


    this.expensesReportForm.get('expensesItems').valueChanges.subscribe(items => {

      this.updateTotalExpenses(items);
    }
    );
    this.expensesReportForm.get('project').valueChanges.subscribe(item => {
      if (this.projectsForPersonalExpenses.length > 0 && !this.expensesReportForm.get('id').value) {
        this.expensesReports.forEach(element => {
          if (element.project.id == item) {
            this.projectAlreadyInUsed = true;
            this.toastr.warning("Project already in used.");
          } else {
            this.projectAlreadyInUsed = false;
          }
        });
      }
    }
    );

    // subscribe to the stream so listen to changes on units

  }

  update(expensesReport) {
    let staffId = parseInt(sessionStorage.getItem('userId'));
    this.expensesReportForm.get('id').setValue(expensesReport.id);
    this.expensesReportForm.get('project').setValue(expensesReport.project.id);
    this.expensesReportForm.get('date').setValue(new Date(moment(expensesReport.date).tz("Asia/Calcutta").format("YYYY-MM-DD")));
    this.expensesReportForm.get('staffMember').setValue({ "id": staffId });
    this.expensesReportForm.get('totalPersonalExpenses').setValue(expensesReport.totalPersonalExpenses);
    this.expensesReportForm.get('totalCompanyCardExpenses').setValue(expensesReport.totalCompanyCardExpenses);
  }

  createFormGroup(expensesReport): FormGroup {
    let staffId = parseInt(sessionStorage.getItem('userId'));
    return this.formBuilder.group({
      id: [null],
      project: [null, Validators.required],
      name: [null],
      date: [new Date()],
      staffMember: [{ "id": staffId }],
      totalPersonalExpenses: [0],
      totalCompanyCardExpenses: [0],
      expensesItems: this.formBuilder.array([]),

    })


  }
  get expensesItemsForm() {
    return this.expensesReportForm.get('expensesItems') as FormArray;
  }



  formatDuration(minutes: number): string {
    let result = Math.floor(minutes / 60) + "h " + Math.floor(minutes % 60) + "m";
    return result;
  }

  openExpensesReportModal(expensesReport: any) {
    if(expensesReport == null){
      this.showPrintButton = false;
    }else{
      this.showPrintButton = true;
    }
    if (this.projectsForPersonalExpenses.length == 0) {
      this.toastr.warning("No Project Available For Logged In User.");
    } else {

      this.clearFormArray(this.expensesItemsForm);
      if (expensesReport) {
        this.update(expensesReport)
        expensesReport.expensesItems.forEach(item => {
          this.addItemsToExpensesReport(item);

        });
        this.selectedExpensesReport = expensesReport;
      }
      this.showExpensesReportModal = true;
    }
    // this.expensesReportForm = this.createFormGroup(expensesReport);

  }
  closeShowExpensesReportModal() {
    if (!this.expensesReportForm.get('project').value) {
      if (confirm("Incomplete form! Do you want to close it ?")) {
        this.showExpensesReportModal = false;
      }
    } else {
      if (confirm("Do you want to save the changes ?")) {
        this.saveOrUpdateExpensesReport();
        this.showExpensesReportModal = false;
      } else {
        this.showExpensesReportModal = false;
      }
    }
    this.projectAlreadyInUsed = false;
  }
  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  addItemsToExpensesReport(ex: any) {
    {
      const expenseItem = this.formBuilder.group({
        id: [ex.id],
        name: [ex.name, Validators.required],
        date: [new Date(ex.date)],
        companyCardExpense: [ex.companyCardExpense],
        personalExpense: [ex.personalExpense]
      });
      // console.log("orderLine",line);
      this.expensesItemsForm.push(expenseItem);
      //  console.log("main ",this.editOrderForm)
    }
  }

  addItemToExpenseReport() {
    const expenseItem = this.formBuilder.group({
      name: [null, Validators.required],
      date: [new Date()],
      companyCardExpense: [0],
      personalExpense: [0]
    });
    this.expensesItemsForm.push(expenseItem)
  }

  removeItemFromExpenseReport(i: number) {
    this.expensesItemsForm.removeAt(i)

  }

  saveOrUpdateExpensesReport() {
    if (this.projectAlreadyInUsed) {
      this.toastr.warning("Expenses report already created for selected project.")
    } else if (!this.expensesReportForm.get('project').value) {
      this.toastr.warning("Please select a project.");
    } else {
      console.log("this.expensesReportForm.value" + this.expensesReportForm.value);
      let body = this.expensesReportForm.value;
      body.project = { "id": body.project }
      this.httpService.callApi('saveOrUpdateExpensesReport', { body: this.expensesReportForm.value }).subscribe(response => {
        this.selectedExpensesReport = response;
        this.toastr.success("Personnel Expenses", "Successfully Saved.");
        this.projectAlreadyInUsed = false;
        this.showExpensesReportModal = false;
        this.reloadPersonalExpenses();

      }, error => {
        this.toastr.error(error.error.message)
        console.log(error.error.message)
      });
    }
  }
  private updateTotalExpenses(items: any) {
    let totalCompanyCardExpense = 0;
    let totalPersonalExpense = 0;
    // get our units group controll
    const control = <FormArray>this.expensesReportForm.controls['expensesItems'];
    // before recount total price need to be reset. 

    for (let i in items) {
      totalCompanyCardExpense = totalCompanyCardExpense + items[i].companyCardExpense;
      totalPersonalExpense = totalPersonalExpense + items[i].personalExpense;
    }
    this.expensesReportForm.get('totalCompanyCardExpenses').setValue(totalCompanyCardExpense);
    this.expensesReportForm.get('totalPersonalExpenses').setValue(totalPersonalExpense);
  }

  deleteExpensesReport() {
    if (confirm("Are you sure to delete?")) {
      let id = this.expensesReportForm.value.id;
      this.httpService.callApi('deleteExpensesReport', { pathVariable: id }).subscribe(response => {
        this.selectedExpensesReport = response;
        this.toastr.success("Personnel Expenses", "Successfully Deleted.");
        this.showExpensesReportModal = false;
        this.reloadPersonalExpenses();
      }, error => {
        this.toastr.error(error.error.message)
        console.log(error.error.message)
      });
    }

  }

  reloadPersonalExpenses() {
    this.getExpensesReportByStaffMemberIdAPI.subscribe(response => {
      this.expensesReports = response;
    }, error => {
      this.toastr.error(error.error.message)
      console.log(error.error.message)
    });
  }
  changesExpensesReportStatus(expensesReport: any) {
    let body = { "id": expensesReport.id, "status": null }
    let massage = "";

    if (expensesReport.status != 'Approved') {

      if (expensesReport.status == 'Created') {
        expensesReport.status = 'Submitted';
        massage = "Submitted Successfully.";
      } else if (expensesReport.status == 'Submitted') {
        expensesReport.status = 'Approved';
        massage = "Approved Successfully.";
      }
      this.blockedPanel=true;
      this.httpService.callApi('changesExpensesReportStatus', { body: expensesReport }).subscribe(response => {
        this.blockedPanel=false;
        expensesReport = response;
        this.toastr.success("Personnel Expenses", massage);
      }, error => {
        this.toastr.error(error.error.message)
        console.log(error.error.message)
      });

    }
    else {
      this.toastr.warning("Already approved.");
    }
  }

  addResourceToLine(line: any) {
    this.blockedPanel = true;
    // line.resource = resource;
    let event = line.event;
    if (event.resource) {
      event.changeable = false;
      this.httpService.callApi('assignEventToLoggedInUser', { body: [event] }).subscribe((resp) => {
        this.blockedPanel = false;
        this.ngOnInit();
      }, (error) => {
        this.blockedPanel = false;
      });
    }
  }

  unassignResourceOnBooking(line) {
    this.blockedPanel = true;
    let event = line.event;
    if (event.resource) {
      event.changeable = false;
      this.httpService.callApi('unassignResourceOnBooking', { pathVariable: line.id }).subscribe((resp) => {
        this.updateGroupBookings();
      }, (error) => {
        this.toastr.error(error.error.message);
        this.blockedPanel = false;
      });
    }
  }

  setUserLeaveRecord(response) {
    this.userLeaveRecordDTO = response;
    if (this.userLeaveRecordDTO.leaveRequestDTOs) {
      this.userLeaveRecordDTO.leaveRequestDTOs.forEach(element => {
        element.startTime = new DayPilot.Date(moment(element.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss")).toString("dd/MM/yy");
        element.endTime = new DayPilot.Date(moment(element.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss")).toString("dd/MM/yy");

      });
    }
  }


  updateGroupBookings() {
    forkJoin([this.getBookingsByLoggedInGroupsAPI, this.getBookingsByLoggedInUserAPI]).subscribe((responseList) => {
      this.userBookingsByGroups = responseList[0];
      this.loggedInUserBookings = responseList[1];
      this.blockedPanel = false;
    }, (errorList) => {
      console.log('errorList => ', errorList)
      this.blockedPanel = false;
    });
  }

  startOrEndUserBookingTime(myBooking, start) {
    let pathVariables = myBooking.id + "/" + start;
    if (start && myBooking.userStartTime) {
      this.toastr.warning('Booking already started.');
    } else if (!start && !myBooking.userStartTime) {
      this.toastr.warning('Please start booking first.');
    } else if (myBooking.userEndTime) {
      this.toastr.warning('Booking already ended.');
    } else {
      this.blockedPanel = true;
      this.httpService.callApi('startOrEndUserBookingTime', { pathVariable: pathVariables }).subscribe((resp) => {
        this.updateGroupBookings();
      }, (error) => {
        this.blockedPanel = false;
      });
    }


  }

  getFormatedDate(date) {
    return moment(date).tz("Asia/Calcutta").format();
  }

  handleBookingCompletionChanges($event, booking) {
    this.blockedPanel = true;
    let pathVariables = booking.id + "/" + $event.value;
    this.httpService.callApi('changeCompletionTimeOnBooking', { pathVariable: pathVariables }).subscribe((resp) => {
      this.updateGroupBookings();
    }, (error) => {
      this.blockedPanel = false;
    });
  }


  showModal() {
    this.leaveRequest.show(this.userLeaveRecordDTO).subscribe(result => {
      // console.log(' resultUpdate ', result)
      if (!result) {
        return; // cancelled
      }
      this.saveRequest(result);
    });
  }

  saveRequest(data) {
    // this.blockedPanel = true;
    let param = {
      staffMemberId: sessionStorage.getItem("userId"),
      userLeaveRecordId: this.userLeaveRecordDTO.userLeaveRecordId,
      changeLeaveRequestDTO: {
        leaveRecordDTO: this.userLeaveRecordDTO.availableLeaveRecordDTOs.find(i => i.leaveRecordId == data.leaveRecordDTO),
        startTime: moment(data.startTime).tz("Asia/Calcutta").format(),
        endTime: moment(data.endTime).tz("Asia/Calcutta").format(),
        numberOfDay: data.numberOfDay,
        leaveStatus: this.userLeaveRecordDTO.leaveStatus[0],
        comment:data.comment
      }
    }
    this.httpService.callApi('saveOrUpdateUserLeaveRequest', { body: param }).subscribe((response) => {
      if (data.avatar) {
        let body = new FormData();
        body.append('fileContent', data.avatar);
        body.append('attachmentType', data.attachmentType);
        body.append('discriminator', 'leave');
        this.httpService.callApi("uploadAttachment", { body: body, pathVariable: response.leaveRequestDTOs[response.leaveRequestDTOs.length - 1].leaveRequestId }).subscribe((respone) => {
          // this.blockedPanel = false;
          respone.startTime = new DayPilot.Date(moment(respone.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss")).toString("dd/MM/yy");
          respone.endTime = new DayPilot.Date(moment(respone.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss")).toString("dd/MM/yy");
          this.userLeaveRecordDTO.leaveRequestDTOs.push(respone);
          this.toastr.success('Successfully Applied', 'User Leave');
        }, (error) => {
          console.log('error ', error)
          // this.blockedPanel = false;
        });
      } else {
        // this.blockedPanel = false;
        let newLeaveRequest = response.leaveRequestDTOs[response.leaveRequestDTOs.length - 1];
        newLeaveRequest.startTime = new DayPilot.Date(moment(newLeaveRequest.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss")).toString("dd/MM/yy");
        newLeaveRequest.endTime = new DayPilot.Date(moment(newLeaveRequest.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss")).toString("dd/MM/yy");
        this.userLeaveRecordDTO.leaveRequestDTOs.push(newLeaveRequest);
        this.setUserLeaveRecord(response);
        this.toastr.success('Successfully Applied', 'User Leave');
      }
    }, (error) => {
      console.log('Error => ', error)
      this.toastr.error(error.error.message, 'User Leave');
      // this.blockedPanel = false;
    })
  }

  printExpensesReport(){
    this.httpService.callApi('getExpensesReport', { pathVariable: this.selectedExpensesReport.id }).subscribe(response => {
      this.downloadSheet(response.expenseReport);
    }, error => {
      this.toastr.error(error.error.message,'Expense Report');
    });
  }

  downloadSheet = (data) => {
    try {
      let sheetData = data;
      let bin = atob(sheetData);
      let buf = new ArrayBuffer(bin.length);
      let view = new Uint8Array(buf);
      for (let i = 0; i != bin.length; ++i) view[i] = bin.charCodeAt(i) & 0xFF;
      let blob = new Blob([buf], {type: "application/pdf"});
      let objectURL = window.URL.createObjectURL(blob);
      let anchor = document.createElement('a');
      anchor.href = objectURL;
      anchor.download = `Expense-Report.pdf`;

      anchor.click();
      URL.revokeObjectURL(objectURL);
    }
    catch (err) {
      console.log(err);
    }

  }

}
