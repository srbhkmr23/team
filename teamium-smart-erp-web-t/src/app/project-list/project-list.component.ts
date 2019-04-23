import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../core/services/http.service';
import { CommonUtilService } from '../core/services/common-util-service';
import { DataService } from '../core/services/data.service';
import { forkJoin } from "rxjs/observable/forkJoin";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  projectId: number;
  projectsStatus: any;
  recentViewedProjects: any;
  showSavePersonnelModal: boolean = false;

  searchText: string;
  filterList: any = [];
  searchList: any;
  blockedPanel: boolean = false;
  recentViewedProjectsAPI: any;
  projectsByStatusAPI: any;


  constructor(private route: ActivatedRoute, private router: Router, private httpService: HttpService, private commonUtilService: CommonUtilService, private dataService: DataService) {
    this.route.params.subscribe(params => this.projectId = params.id);
  }

  ngOnInit() {
    this.blockedPanel = true;
    this.route.params.subscribe(params => this.projectId = params.id);
    let pathVariable: any = new Array();
    pathVariable.push(this.projectId);
    this.dataService.addPathvariables(pathVariable);

    this.dataService.checkSubmenu(this.router);

    this.recentViewedProjectsAPI = this.httpService.callApi('getRecentViewedProjects', {});
    this.projectsByStatusAPI = this.httpService.callApi('getProjectsByStatus', {});
    // this.getProjectsByStatus();
    // this.getRecentViewedProjects();

    forkJoin([this.recentViewedProjectsAPI, this.projectsByStatusAPI]).subscribe(resultList => {
      this.blockedPanel = false;
      this.recentViewedProjects = resultList[0];
      this.projectsStatus = resultList[1];
      if(!this.projectsStatus['To Do']){
        this.projectsStatus['To Do']=[]
        }
        if(!this.projectsStatus['In Progress']){
        this.projectsStatus['In Progress']=[]
        }
        if(!this.projectsStatus['Done']){
        this.projectsStatus['Done']=[]
        }


    }, (errorList) => {
      this.blockedPanel = false;
      console.log('Error[0] ', errorList[0]);
      console.log('Error[1] ', errorList[1]);
    });


    this.searchList = new Array();
    this.searchList.push('title');
    this.searchList.push('city');
    this.searchList.push('category');
    this.searchList.push('company');
    this.searchList.push('program');

  }

  // ======== FOR DRAG AND DROP ======== //
  onItemDropInToDo(e: any) {

    try {
      if (e.dragData.status != 'To Do') {
        if (e.dragData.status == 'In Progress') {
          this.projectsStatus['In Progress'].splice(this.projectsStatus['In Progress'].indexOf(e.dragData), 1);
        }

        if (e.dragData.status == 'Done') {
          this.projectsStatus['Done'].splice(this.projectsStatus['Done'].indexOf(e.dragData), 1)
        }

        e.dragData.status = 'To Do';
        this.projectsStatus['To Do'].push(e.dragData);
        let project = e.dragData;
        this.changeProjectStaus(project.id, 'To Do');
      }
    }
    catch (err) {
      console.log(err)
    }


  }
  onItemDropInProgress(e: any) {
    try {
      if (e.dragData.status != 'In Progress') {
        if (e.dragData.status == 'To Do')
          this.projectsStatus['To Do'].splice(this.projectsStatus['To Do'].indexOf(e.dragData), 1);

        if (e.dragData.status == 'Done')
          this.projectsStatus['Done'].splice(this.projectsStatus['Done'].indexOf(e.dragData), 1)

        e.dragData.status = 'In Progress';
        this.projectsStatus['In Progress'].push(e.dragData);
        let project = e.dragData;
        this.changeProjectStaus(project.id, 'In Progress');
      }

    }
    catch (err) {
      console.log(err)
    }

  }
  onItemDropInDone(e: any) {

    try {
      if (e.dragData.status != 'Done'&& e.dragData.status != 'To Do') {
        if (e.dragData.status == 'In Progress')
          this.projectsStatus['In Progress'].splice(this.projectsStatus['In Progress'].indexOf(e.dragData), 1);

        if (e.dragData.status == 'To Do')
          this.projectsStatus['To Do'].splice(this.projectsStatus['To Do'].indexOf(e.dragData), 1);

        e.dragData.status = 'Done';
        this.projectsStatus['Done'].push(e.dragData);
        let project = e.dragData;
        this.changeProjectStaus(project.id, 'Done');
      }

    }
    catch (err) {
      console.log(err)
    }

  }


  getProjectsByStatus() {
    this.httpService.callApi('getProjectsByStatus', {}).subscribe(response => {
      this.projectsStatus = response;
      this.blockedPanel = false;
    }, error => {

      console.log(error);
    });
  }

  getRecentViewedProjects() {
    this.httpService.callApi('getRecentViewedProjects', {}).subscribe(response => {
      this.recentViewedProjects = response;

    }, error => {
      console.log(error);
    });
  }
  goToDetails(projectId: number) {
    let pathVariable: any = new Array();
    pathVariable.push({ "budgetId": projectId });
    this.dataService.addPathvariables(pathVariable);
    this.openSubMenu();
  }

  openSubMenu() {
    this.dataService.openSubmenu();
  }
  closeModal($event) {
    this.showSavePersonnelModal = $event
    this.ngOnInit();
  }
  /*-  To save equipment*/
  changeProjectStaus(id: number, status: string) {
    this.blockedPanel = true;
    let body = { "id": id, "status": status }
    this.httpService.callApi('changesProjectStatus', { body: body }).subscribe((response) => {
      this.blockedPanel = false;
      //this.toastr.success("Successfully saved", 'Bugeting');
      let projectDetail = response;

    }, error => {
      this.blockedPanel = false;
      console.log('Error getstatus => ', error)
    });
  }

}
