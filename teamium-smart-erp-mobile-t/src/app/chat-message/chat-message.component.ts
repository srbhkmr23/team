import { Component, OnInit } from '@angular/core';
import { CommonDataService } from '../core/services/common-data.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {
  isUserListActive:boolean=false;
  constructor(public commonDataService: CommonDataService) { }
  ngOnInit() {
    this.commonDataService.setActivePage('message');
  }

  showUserList=()=>{
    this.isUserListActive=true;
  }

  hideUserList=(ev)=>{
    this.isUserListActive=false;
  }

}
