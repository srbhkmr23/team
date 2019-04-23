import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar-modal',
  templateUrl: './sidebar-modal.component.html',
  styleUrls: ['./sidebar-modal.component.scss']
})
export class SidebarModalComponent implements OnInit {
  
  @Output() closeModalEvent=new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

  hideSidebarModal() {
    this.closeModalEvent.emit(false);
  }

}
