import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment-timezone';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-actual-budget-modal',
  templateUrl: './actual-budget-modal.component.html',
  styleUrls: ['./actual-budget-modal.component.scss']
})
export class ActualBudgetModalComponent implements OnInit {
  @Input() actualBudgetModalData: any;
  @Output() closeModalEvent=new EventEmitter<boolean>();
  resource:any;
  sheetData:any;
  constructor() { }

  ngOnInit() {
      console.log("Actual", this.actualBudgetModalData);
      this.resource = this.actualBudgetModalData.resource;
  }

  downloadSheet=()=>{
    try{
        console.log(this.actualBudgetModalData);
      let sheetData=this.actualBudgetModalData.spreadsheetFile;
      let bin = atob(sheetData);
      let ab = this.s2ab(bin); 
      let blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
      let objectURL = window.URL.createObjectURL(blob);
      let anchor = document.createElement('a');
      anchor.href = objectURL;
      anchor.download = this.resource==='actualComparison'?`Actual-Comparison.xlsx`:`Project-Actual.xlsx`;
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

  hideActualBudgetModal() {
    this.closeModalEvent.emit(false);
  }

}
