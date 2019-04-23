import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '../../../node_modules/@angular/forms';
import { HttpService } from '../core/services/http.service';
import { DataService } from '../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ToastrService } from '../../../node_modules/ngx-toastr';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-personal-expenses',
  templateUrl: './personal-expenses.component.html',
  styleUrls: ['./personal-expenses.component.scss']
})
export class PersonalExpensesComponent implements OnInit {
  expensesReportForm: any;
  timeSheet: any = [];
  expensesReports: any = [];
  showExpensesReportModal: boolean;
  projectsForPersonalExpenses: any = [];
  selectedExpensesReport: any;
  projectAlreadyInUsed: boolean = false;
  personnelId: number;
  fromDate=null;
  toDate=null;
  getExpensesReportByStaffMemberIdAPI: any;
  selectedPersonnel:any;
  searchText:string="";
  showPrintButton: boolean = true;
  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private route: ActivatedRoute, private dataService: DataService, private router: Router, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);
    this.route.params.subscribe(params => this.personnelId = params.id);
    this.dataService.getSelectedPersonnel(this.personnelId, (response) => {
      this.selectedPersonnel = response;
    })
    let pathVariable: any = new Array();
    // pathVariable.push(this.personnelId);
    pathVariable.push({ "staffId": this.personnelId });
    this.dataService.addPathvariables(pathVariable);
    let weeklyDurationAPI = this.httpService.callApi('findWeeklyWorkingDuration', { pathVariable: "/" + sessionStorage.getItem('userId') });
    this.getExpensesReportByStaffMemberIdAPI = this.httpService.callApi('getExpensesReportByStaffMemberId', { pathVariable: "/" + this.personnelId });
    forkJoin([weeklyDurationAPI, this.getExpensesReportByStaffMemberIdAPI]).subscribe((responseList) => {
      this.timeSheet = responseList[0];
      this.expensesReports = responseList[1];
      this.timeSheet.forEach(element => {
        element.duration = this.formatDuration(element.totalDuration)
      });
      // this.blockedPanel = false;
    }, (errorList) => {
      console.log('errorList => ', errorList)
      // this.blockedPanel = false;
    });
    this.expensesReportForm = this.createFormGroup(null);
    // this.expensesReportForm.reset();
    this.httpService.callApi('getProjectsForExpensesReport', { pathVariable: this.personnelId }).subscribe(response => {
      this.projectsForPersonalExpenses = response;
    }, error => {
      // this.toastr.error(error.error.message)
      console.log(error.error.message)
    });

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
          }else{
            this.projectAlreadyInUsed = false;
          }
        });
      }
    }
    );
  }

  update(expensesReport) {
    let staffId = this.personnelId;
    this.expensesReportForm.get('id').setValue(expensesReport.id);
    this.expensesReportForm.get('project').setValue(expensesReport.project.id);
    this.expensesReportForm.get('date').setValue(new Date(moment(expensesReport.date).tz("Asia/Calcutta").format("YYYY-MM-DD")));
    this.expensesReportForm.get('staffMember').setValue({ "id": staffId });
    this.expensesReportForm.get('totalPersonalExpenses').setValue(expensesReport.totalPersonalExpenses);
    this.expensesReportForm.get('totalCompanyCardExpenses').setValue(expensesReport.totalCompanyCardExpenses);
  }

  createFormGroup(expensesReport): FormGroup {
    return this.formBuilder.group({
      id: [null],
      project: [null, Validators.required],
      name: [null],
      date: [new Date(moment().tz("Asia/Calcutta").format("YYYY-MM-DD"))],
      staffMember: [{ "id": this.personnelId }],
      totalPersonalExpenses: [0],
      totalCompanyCardExpenses: [0],
      expensesItems: this.formBuilder.array([]),

    })


  }
  get expensesItemsForm() {
    return this.expensesReportForm.get('expensesItems') as FormArray;
  }

  resetDateRange(){
    this.fromDate=null;
    this.toDate=null;
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
    if(this.projectsForPersonalExpenses.length==0){
       this.toastr.warning("No Project Available For Logged In User.");
    }else{
 
     this.clearFormArray(this.expensesItemsForm);
     if(expensesReport){
       this.update(expensesReport)
       expensesReport.expensesItems.forEach(item => {
         this.addItemsToExpensesReport(item);
        
       });
       this.selectedExpensesReport = expensesReport;
     }
     else {
      this.expensesReportForm.get('id').setValue(null);
      this.expensesReportForm.get('project').setValue(null);
      this.expensesReportForm.get('date').setValue(new Date(moment().tz("Asia/Calcutta").format("dd/MM/yyyy")));
      this.expensesReportForm.get('staffMember').setValue({ "id": this.personnelId });
      this.expensesReportForm.get('totalPersonalExpenses').setValue(0);
      this.expensesReportForm.get('totalCompanyCardExpenses').setValue(0);
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
        date: [new Date(moment(ex.date).tz("Asia/Calcutta").format("YYYY-MM-DD"))],
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
      date: [new Date(moment().tz("Asia/Calcutta").format("YYYY-MM-DD"))],
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
    }else if(!this.expensesReportForm.get('project').value){
      this.toastr.warning("Please select a project.")
    }else {
      console.log("this.expensesReportForm.value" + this.expensesReportForm.value);
      let body = this.expensesReportForm.value;
     let project ={"id":body.project}
       body.project = project;
       console.log("body",body);

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
      body=this.expensesReportForm.value;
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
        this.projectAlreadyInUsed = false;
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

      this.httpService.callApi('changesExpensesReportStatus', { body: expensesReport }).subscribe(response => {
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
