import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment-timezone';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-equipment-personal-modal',
  templateUrl: './equipment-personal-modal.component.html',
  styleUrls: ['./equipment-personal-modal.component.scss']
})
export class EquipmentModalComponent implements OnInit {
  @Input() resourceModalData: any;
  @Output() closeModalEvent=new EventEmitter<boolean>();
  sheetData:any;
  constructor() { }

  ngOnInit() {
  }

  downloadSheet=()=>{
    try{
        // console.log("resourcesata = ",this.resourceModalData);
      let sheetData=this.resourceModalData.spreadsheetFile;
      let bin = atob(sheetData);
      let ab = this.s2ab(bin); 
      let blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
      let objectURL = window.URL.createObjectURL(blob);
      let anchor = document.createElement('a');
      anchor.href = objectURL;
      if(this.resourceModalData.resourceName==='equipment'){
        anchor.download = `Project-Equipment.xlsx`;
      }
      else{
        anchor.download = `Project-Personnel.xlsx`;
      }
      
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

  hideBudgetingModal() {
    this.closeModalEvent.emit(false);
  }

}
