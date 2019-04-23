import { Injectable } from '@angular/core';

// import { Subject } from 'rxjs/Subject';
// import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

import { ConfigService } from './config.service'

@Injectable()
export class ChatService {
  private url = '';//'http://192.168.1.113:7000';  
  private socket;

  constructor(public configService: ConfigService) {
    this.url = 'http://' + configService.NODE_SERVER_HOST + ':' + configService.NODE_SERVE_PORT; //'http://192.168.1.113:7000';
  }
 
  sendMessage(message) {
    if (this.socket) {
      this.socket.emit('sendMessage', message);
    }
  }

  doOffline = (userId) => {
    this.socket.emit('offline', {"userId":userId,"socketId":this.socket.id});
    this.socket.disconnect();
  }

  getConnect(id) {
    let observable = new Observable(observer => {
      this.socket = io(this.url, { query: `id=${id}` });

      this.socket.on('connect', () => {
        let from = id|| '';
        let data={
          to:from
        }
        // this.getAllMessageNotifications(data);
      });

      

      this.socket.on('newUserConnect', (data) => {
        observer.next({ type: 'newUserConnect', data: data });
      });

      this.socket.on('getMessage', (data) => {
        observer.next({ type: 'getMessage', data: data });
      });

      this.socket.on('getAllMessage', (data) => {
        observer.next({ type: 'getAllMessage', data: data });
      });

      this.socket.on('getUserIsTyping', (data) => {
        observer.next({ type: 'getUserIsTyping', data: data });
      });


      this.socket.on('setAllMessageNotifications', (data) => {
        observer.next({ type: 'setAllMessageNotifications', data: data });
      });

      this.socket.on('newconnection', (data) => {
        observer.next({ type: 'newconnection', data: data });
      });

      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }


  getAllMessage = (data) => {
  
    if (this.socket) {
      data["socketId"]=this.socket.id;
      this.socket.emit('getAllMessage', data);
    }
  }

  getAllMessageNotifications = (data)=>{
    // console.log(this.socket.id)
    if (this.socket) {
      data["socketId"]=this.socket.id;
      this.socket.emit('getAllMessageNotifications', data);
    }
  }

  setMessageSeenByUser = (data) =>{
    if (this.socket) {
      this.socket.emit('setMessageSeenByUser', data);
    }
  }
 
  setUserIsTyping = (data) =>{
    if (this.socket) {
      this.socket.emit('setUserIsTyping', data);
    }
  }
}