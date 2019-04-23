import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import { moment } from 'fullcalendar';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  blockedPanel: boolean = false;
  searchText: string = "";
  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) { }

  //For FromDate and ToDate
  mainForm: FormGroup;

  //For time report.
  staffList: any = [];
  selectedStaff: any = null;
  

  ngOnInit() {
    this.getStaffData();
    this.mainForm = this.createFormGroup();
  }

  getStaffData() {
    this.blockedPanel = true;
    this.httpService.callApi('getPersonals', {}).subscribe((response) => {
      this.staffList = response;
    }, (error) => {
      this.toastr.error(error.error.message, 'Report');
    });
    this.blockedPanel = false;
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
  }

  downloadTimeReport(reportType) {
    if (!this.selectedStaff || this.selectedStaff === 'null') {
      this.toastr.warning("Please select staff", "Report");
      return;
    }
    if (this.mainForm.invalid) {
      if(this.mainForm.get("fromDate").value && this.mainForm.get("toDate").invalid){
        this.toastr.warning("Please select to date", "Report");
        return;
      }
      if(this.mainForm.get("toDate").value && this.mainForm.get("fromDate").invalid){
        this.toastr.warning("Please select from date", "Report");
        return;
      }
    }
    let params = new HttpParams();
    if (this.mainForm.get("fromDate").value && this.mainForm.get("toDate").value) {
      params = params.append('startdate', moment(this.mainForm.get("fromDate").value).tz("Asia/Calcutta").format("YYYY-MM-DD") + "T00:00:00.000");
      params = params.append('enddate', moment(this.mainForm.get("toDate").value).tz("Asia/Calcutta").format("YYYY-MM-DD") + "T01:00:00.000");
    }
    params = params.append('staffid', this.selectedStaff);
    this.blockedPanel = true;
    this.httpService.callApi(reportType, { params: params }).subscribe((response) => {
      this.downloadSheet(response, reportType);
    }, (error) => {
      this.toastr.error(error.error.message, 'Report');
    });
    this.blockedPanel = false;
  }


  downloadSheet = (timeReportData, reportType) => {
    try {
      let sheetData = timeReportData.spreadsheetFile;
      let bin = atob(sheetData);
      let buf = new ArrayBuffer(bin.length);
      let view = new Uint8Array(buf);
      for (let i = 0; i != bin.length; ++i) view[i] = bin.charCodeAt(i) & 0xFF;
      let blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
      let objectURL = window.URL.createObjectURL(blob);
      let anchor = document.createElement('a');
      anchor.href = objectURL;
      if (reportType === 'getTimeReportByWeek') {
        anchor.download = `Time-Report-By-Week.xlsx`;
      } else if (reportType === 'getAnnualPersonnelTimeReport') {
        anchor.download = `Annual-Personnel-Time-Report.xlsx`;
      } else if (reportType === 'getWeeklyPersonnelTimeReport') {
        anchor.download = `Weekly-Personnel-Time-Report.xlsx`;
      }

      anchor.click();
      URL.revokeObjectURL(objectURL);
    }
    catch (err) {
      console.log(err);
    }

  }

}
