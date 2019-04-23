import { Component, OnInit, Input } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../core/services/http.service';
import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';
import { DataService } from '../core/services/data.service';
import { forkJoin } from "rxjs/observable/forkJoin";

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  @Input() componentName='Group';
  searchText: any="";
  isfiterClicked: boolean;
  isFilterByFunctionClicked: boolean;
  functionCheckBoxList: any;
  modelCheckBoxList: any;
  locationCheckBoxList: any;
  isSortByClicked: boolean;
  terms:any=["firstName","lastName","mainFunction"]
  

  groupList:any=[];
  staffList:any=[];
  selectedGroup:any;
  selectedStaff:any=[];
  selectedColor:string = '#161514';
  groupForm: FormGroup;


  isModalVisible:boolean=false;
  blockedPanel:boolean=false;
  showDeleteModal:boolean=false;

  constructor(private dataService: DataService, private router: Router,private formBuilder: FormBuilder, private httpService: HttpService,private toastr: ToastrService) {
    this.groupForm = this.createGroupForm();
  } 

  ngOnInit() {
    this.dataService.checkSubmenu(this.router);
    this.getGroupData();
  }

  createGroupForm(){
    return this.formBuilder.group({
        groupName: [null,Validators.required]
    });
  }

  getGroupData=()=>{
    let groupDataAPI = this.httpService.callApi('getGroups', {});
    let staffDataAPI = this.httpService.callApi('getAvailablePersonals', {});
    this.blockedPanel=true;
    forkJoin([groupDataAPI,staffDataAPI]).subscribe(resultList => {
      console.log(resultList);
      this.blockedPanel = false;
      this.groupList = resultList[0];
      this.staffList=resultList[1];
    }, (errorList) => {
      this.blockedPanel = false;
      console.log('Error[0] ', errorList[0]);
    });
  }



  setGroupFormData = () => {
    try{
      // set contact data
      let selectedGroup = this.selectedGroup;
      if(selectedGroup && selectedGroup.hasOwnProperty('id')){
        this.groupForm.get('groupName').setValue(selectedGroup.name);
        this.selectedStaff = JSON.parse(JSON.stringify(selectedGroup["groupMembers"]));
        this.selectedColor= selectedGroup["colorTheme"] || '#161514';
      }
      else{
        this.groupForm.get('groupName').setValue(null);
        this.selectedStaff = [];
        this.selectedColor= '#161514';
      }
    }
    catch(err){
      console.log(err)
    }
  }


  isMember=(id)=>{
    let available=false;
    this.selectedStaff.forEach(staff => {
      if(staff.id==id){
        available=true;
      }
    });
    return available;
  }


  onChangeStaff=(staff)=>{
    let id=staff.id;
    let index;
    this.selectedStaff.forEach((staff,i) => {
      if(staff.id==id){
        index=i;
      }
    });

    if(index>=0){
      this.selectedStaff.splice(index,1);
    }
    else{
      this.selectedStaff.push(staff);
    }
  }


  saveGroup=()=>{
    let body = this.getGroupJson();
    this.blockedPanel=true;
     this.httpService.callApi('saveGroup', { body: body }).subscribe((response) => {
      this.blockedPanel=false;
      this.toastr.success("Successfully Saved", 'Group');
      this.getGroupData();
      this.hideModal();
    }, error => {
      this.blockedPanel=false;
      this.toastr.error(error.error.message, 'Group');
      console.log('Error getstatus => ', error)
    });
 
  }

  getGroupJson=()=>{
    let name=this.groupForm.get("groupName").value;
    let selectedStaff= this.selectedStaff || [];
    let colorTheme = this.selectedColor;
    let sendDataObject={
      "name": name,
      "groupMembers": selectedStaff,
      "colorTheme":colorTheme
    }
    let selectedGroup = this.selectedGroup;
    if(selectedGroup && selectedGroup.hasOwnProperty('id')){
      sendDataObject["id"]=selectedGroup.id;
    }
    return sendDataObject;
  }

  deleteGroup=($event)=>{
    if($event){
      let selectedGroup = this.selectedGroup;
      if(selectedGroup && selectedGroup.hasOwnProperty('id')){
       let id = selectedGroup.id;
       let pathVariable = "/"+id;
       this.blockedPanel=true;
       this.httpService.callApi('deleteGroup', { pathVariable: pathVariable }).subscribe((response) => {
          this.blockedPanel=false;
          this.toastr.success("Successfully Deleted", 'Group');
          this.getGroupData();
          this.showDeleteModal=false;
          this.hideModal();
        }, 
        error => {
          this.blockedPanel=false;
          this.toastr.error(error.error.message, 'Group');
          console.log('Error getstatus => ', error)
        });
      }
    }

    
  }
  
  onShowModal=(group)=>{
    if(group && group.hasOwnProperty('id')==true){
      this.selectedGroup = group;
      this.setGroupFormData()
      this.showModal();
    }
    else{
      this.selectedGroup =null;
      this.setGroupFormData()
      this.showModal();
    }
  }


  showModal=()=>{
    this.isModalVisible=true
  }

  hideModal=()=>{
    this.isModalVisible=false;
  }
  hideDeleteModal($event){
    this.showDeleteModal=$event;
  }
}
