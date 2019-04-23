import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { HttpService } from '../core/services/http.service';
import { DataService } from '../core/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-list',
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.scss']
})
export class ShowListComponent implements OnInit {
  blockedPanel: any;
  recentViewedShows: any=[];
  searchText: any;
  showsObject: any = {};
  searchList:any = [];
  showSaveShowModal:boolean;

  constructor(private dataService:DataService,private router:Router,private httpService: HttpService) { }

  ngOnInit() {
    this.blockedPanel = true;
    this.searchList=['title','city','category','company','program','season','startString']
   
   
    this.dataService.checkSubmenu(this.router);
 
    let recentViewedShowsAPI = this.httpService.callApi('getRecentViewedShows', {});
    let showsByStatusAPI = this.httpService.callApi('getShowsByStatus', {});
    // this.getProjectsByStatus();
    // this.getRecentViewedProjects();

    forkJoin([recentViewedShowsAPI, showsByStatusAPI]).subscribe(resultList => {
      this.blockedPanel = true;
      this.recentViewedShows = resultList[0];
      this.showsObject = resultList[1];
      if (!this.showsObject['To Do']) {
        this.showsObject['To Do'] = [];
      }
      if (!this.showsObject['In Progress']) {
        this.showsObject['In Progress'] = [];
      }
      if (!this.showsObject['Done']) {
        this.showsObject['Done'] = [];
      }
      this.blockedPanel = false;

    }, (errorList) => {
      this.blockedPanel = false;
      console.log('Error[0] ', errorList[0]);
      console.log('Error[1] ', errorList[1]);
    });

  }

  // ======== FOR DRAG AND DROP ======== //
  onItemDropInToDo(e: any) {

    try {

      if (e.dragData.status == 'In Progress') {
        this.showsObject['In Progress'].splice(this.showsObject['In Progress'].indexOf(e.dragData), 1);
      }

      if (e.dragData.status == 'Done') {
        this.showsObject['Done'].splice(this.showsObject['Done'].indexOf(e.dragData), 1)
      }

      e.dragData.status = 'To Do';
      this.showsObject['To Do'].push(e.dragData);

    }
    catch (err) {
      console.log(err)
    }


  }
  onItemDropInProgress(e: any) {
    try {
      if (e.dragData.status == 'To Do')
        this.showsObject['To Do'].splice(this.showsObject['To Do'].indexOf(e.dragData), 1);

      if (e.dragData.status == 'Done')
        this.showsObject['Done'].splice(this.showsObject['Done'].indexOf(e.dragData), 1)

      e.dragData.status = 'In Progress';
      this.showsObject['In Progress'].push(e.dragData)
    }
    catch (err) {
      console.log(err)
    }

  }
  onItemDropInDone(e: any) {

    try {
      if (e.dragData.status == 'In Progress')
        this.showsObject['In Progress'].splice(this.showsObject['In Progress'].indexOf(e.dragData), 1);

      if (e.dragData.status == 'To Do')
        this.showsObject['To Do'].splice(this.showsObject['To Do'].indexOf(e.dragData), 1)

      e.dragData.status = 'Done';
      this.showsObject['Done'].push(e.dragData)
    }
    catch (err) {
      console.log(err)
    }

  }

  goToDetails(projectId: number) {
    let pathVariable: any = new Array();
    pathVariable.push({ "showId": projectId });
    this.dataService.addPathvariables(pathVariable);
    this.openSubMenu();
  }
  openSubMenu() {
    this.dataService.openSubmenu();
  }

  closeModal($event) {
    this.showSaveShowModal = $event
    this.ngOnInit();
  }
}
