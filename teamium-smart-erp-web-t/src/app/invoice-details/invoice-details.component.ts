import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {
  pdfOnClick:boolean;
  closeModal:boolean;
  line:any;
  blockedPanel:boolean;
  i:any;

  constructor() { }

  ngOnInit() {
  }

}
