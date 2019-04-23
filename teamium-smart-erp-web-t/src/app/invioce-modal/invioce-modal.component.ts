import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invioce-modal',
  templateUrl: './invioce-modal.component.html',
  styleUrls: ['./invioce-modal.component.scss']
})
export class InvioceModalComponent implements OnInit {

  blockedPanel:boolean;

  constructor() { }

  ngOnInit() {
  }
  closeModal(){
    
  }
}
