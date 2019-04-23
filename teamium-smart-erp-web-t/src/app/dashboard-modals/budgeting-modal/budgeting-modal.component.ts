import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment-timezone';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-budgeting-modal',
  templateUrl: './budgeting-modal.component.html',
  styleUrls: ['./budgeting-modal.component.scss']
})
export class BudgetingModalComponent implements OnInit {
  @Input() budgetingModalData: any;
  @Output() closeModalEvent=new EventEmitter<boolean>();
  sheetData:any;
  constructor() { }

  ngOnInit() {
      console.log("Actual")
  }

  downloadSheet=()=>{
    try{
        console.log(this.budgetingModalData);
      let sheetData=this.budgetingModalData.spreadsheetFile;
      let bin = atob(sheetData);
      let ab = this.s2ab(bin); 
      let blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
      let objectURL = window.URL.createObjectURL(blob);
      let anchor = document.createElement('a');
      anchor.href = objectURL;
      anchor.download = `Project-Revenue.xlsx`;
      anchor.click();
      URL.revokeObjectURL(objectURL);
    }
    catch(err){
      console.log(err);
    }
    
  }

  s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  getFormateddate=(date)=>{
    try{
      if(date){
        return moment(date).format('DD/MM/YYYY')
      }
      else{
        return '';
      }
    }
    catch(err){
      console.log(err)
      return '';
    }
  }

  hideBudgetingModal() {
    this.closeModalEvent.emit(false);
  }

}
