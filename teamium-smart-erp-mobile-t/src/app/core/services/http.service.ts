import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';
import { ConfigService } from './config.service';
import { CommonDataService } from './common-data.service';
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(public configService: ConfigService,private httpClient: HttpClient, public urlsService: UrlsService,public commonDataService: CommonDataService) { }
  callApi(action, options: { body?: any, headers?: HttpHeaders, params?: HttpParams, pathVariable?: any }): Observable<any> {
    let urlObject = this.urlsService.urlObject[action];
    let method = urlObject.method;
    let url = urlObject.url + (options.pathVariable || '');


    let host ='';
    let port ='';
    try{
      let userInstance = this.commonDataService.getUserInstance();
      host = this.configService.INSTANCES[userInstance].HOST;
      port = this.configService.INSTANCES[userInstance].PORT;
    }
    catch(ex){
      console.error(ex);
      this.commonDataService.clearUserInstance();
      this.commonDataService.logout();
    }
    
    let urlString = 'http://' + host + ':' + port + '/teamiumapp/';
    // let urlString = 'http://' + host + ':' + port + '/';
    url = urlString + url;

    return this.httpClient.request(method, url, options)
      .pipe(
        tap(result => {
          return result;
        }, error => {
          console.error('Eroor => ', error.status)
          if (error.status == 401) {
            this.commonDataService.logout();
          }
        }));
  }
}
