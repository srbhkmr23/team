import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { catchError, map, tap } from 'rxjs/operators';
import { UrlsService } from './urls.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private httpClient: HttpClient, public urlsService: UrlsService, private router: Router) {
  }

  // using httpclient
  callApi(action, options: { body?: any, headers?: HttpHeaders, params?: HttpParams, pathVariable?: any }): Observable<any> {
    let urlObject = this.urlsService.urlObject[action];
    let method = urlObject.method;
    let url = urlObject.url + (options.pathVariable || '');
    return this.httpClient.request(method, url,options)
      .pipe(
        tap(result => {
          return result;
        }, error => {
          console.log('Error => ', error.status)
          if (error.status == 401) {
            this.logout();
          }
        }));
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['signin']);
  }


  getEvents() {
    return this.httpClient.get<any>('assets/data/scheduleevents.json')
      .toPromise()
      .then(res => <any[]>res.data)
      .then(data => { return data; });
  }
}