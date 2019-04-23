import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vendor-bidding',
  templateUrl: './vendor-bidding.component.html',
  styleUrls: ['./vendor-bidding.component.scss']
})
export class VendorBiddingComponent implements OnInit {
  showOrderEditModal: boolean;
  searchText:string="";
  constructor() { }

  ngOnInit() {
  }
  closeOrderWinodw(){
    this.showOrderEditModal=false;
  }
}
