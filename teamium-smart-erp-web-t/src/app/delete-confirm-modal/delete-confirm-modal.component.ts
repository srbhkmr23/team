import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-delete-confirm-modal',
  templateUrl: './delete-confirm-modal.component.html',
  styleUrls: ['./delete-confirm-modal.component.scss']
})
export class DeleteConfirmModalComponent implements OnInit {
  @Input() componentName:any;
  @Output() deleteDataEvent=new EventEmitter<boolean>();
  @Output() closeModalEvent=new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
    
  }
  delete(){
    this.deleteDataEvent.emit(true);
  }
  hideModal(){
    this.closeModalEvent.emit(false);
  }

}
