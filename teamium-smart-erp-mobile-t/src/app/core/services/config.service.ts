import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  HOST: string;
  PORT: string;
  public INSTANCES:any;
  constructor() { 
    this.HOST = '52.206.76.204';
    this.PORT = '80';


    this.INSTANCES = {
      'local':{HOST:'192.168.1.220',PORT:'8180'},
      'uspft':{HOST:'52.206.76.204',PORT:'80'},
      'canal9':{HOST:'18.185.72.112',PORT:''},
      'mumbai':{HOST:'13.127.157.152',PORT:'8180'},
    }




    // this.HOST = '192.168.1.220';
    // this.PORT = '8180';
    // this.HOST = '192.168.1.183';
    // this.PORT = '8180';
  }
}