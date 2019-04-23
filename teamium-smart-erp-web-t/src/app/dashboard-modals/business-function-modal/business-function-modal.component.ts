import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-business-function-modal',
  templateUrl: './business-function-modal.component.html',
  styleUrls: ['./business-function-modal.component.scss']
})
export class BusinessFunctionModalComponent implements OnInit {
  @Input() businessFunctionModalData: any;
  @Output() closeModalEvent=new EventEmitter<boolean>();
  keys: any =[];
  constructor() { }

  ngOnInit() {

    this.keys= Object.keys(this.businessFunctionModalData.functionPerUses) || [];

  }


  downloadSheet=()=>{
    try{
      let sheetData=this.businessFunctionModalData.spreadsheetFile;
      let bin = atob(sheetData);
      let ab = this.s2ab(bin); 
      let blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
      let objectURL = window.URL.createObjectURL(blob);
      let anchor = document.createElement('a');
      anchor.href = objectURL;
      anchor.download = `Business-Function.xlsx`;
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


  hideBusinessFunctionModal() {
    this.closeModalEvent.emit(false);
  }

}
