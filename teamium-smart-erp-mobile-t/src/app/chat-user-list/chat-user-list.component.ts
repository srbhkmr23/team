import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.scss']
})
export class ChatUserListComponent implements OnInit {
  @Input() isUserListActive: any;
  @Output() closeUserListEvent=new EventEmitter<boolean>();
  constructor() { }
  
  ngOnInit() {
  }

  hideUserList() {
    this.closeUserListEvent.emit(false);
  }

}
