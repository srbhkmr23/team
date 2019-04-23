import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  HOST: string;
  PORT: string;
  NODE_SERVER_HOST:string;
  NODE_SERVE_PORT:string;
  constructor() {

   this.HOST = '192.168.1.220';
  //  this.HOST = 'localhost';
    //this.HOST = '192.168.1.163';
      //this.HOST = 'localhost';
     // this.HOST = '13.127.157.152';
    this.PORT = '8180';
    // this.PORT = '8999';

    this.NODE_SERVER_HOST = '192.168.1.220';
    this.NODE_SERVE_PORT =  '7000';





 
  }
}
