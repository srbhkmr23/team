import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-invoice',
  templateUrl: './project-invoice.component.html',
  styleUrls: ['./project-invoice.component.scss']
})
export class ProjectInvoiceComponent implements OnInit {

  projectDetail: any;
  blockedPanel:boolean=false;
  invoiceModal:boolean=false;
 
  constructor() { }

  ngOnInit() {
  }

  hideInvoiceModal(){
    this.invoiceModal=true;
  }
}
