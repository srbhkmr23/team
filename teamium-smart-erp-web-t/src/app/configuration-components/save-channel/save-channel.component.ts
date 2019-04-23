import { Component, OnInit, Input, Output,EventEmitter, HostListener, ElementRef  } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { fork } from 'cluster';
import { forkJoin } from "rxjs/observable/forkJoin";
import { UiSwitchModule } from 'ngx-toggle-switch';
import { FormGroup, FormBuilder, Validators, FormArray } from '../../../../node_modules/@angular/forms';
import { TouchSequence } from 'selenium-webdriver';


@Component({
  selector: 'app-save-channel',
  templateUrl: './save-channel.component.html',
  styleUrls: ['./save-channel.component.scss']
})
export class SaverChannelConfiguration implements OnInit {
  blockedPanel:boolean=false;
  @Input()componentName='Channel';
  @Input() selectedChannel: any;
  @Output() closeModalEvent=new EventEmitter<boolean>();

  formatList:any=[];
  groupForm:any;
  delete:boolean = false;

  templateNameList:any=[];
  searchText:string="";
  terms:any;
  title:any;
  showDeleteModal:boolean=false;
  channelDetail:any;

  constructor(private httpService:HttpService, private toastr: ToastrService, private formBuilder:FormBuilder){
    this.groupForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      channelName :[null],

    })

  }
  ngOnInit(){
    
    if(!this.selectedChannel.hasOwnProperty('id')){
      this.title = "Create Channel";
      this.selectedChannel = {};
      this.selectedChannel['formats'] = [];
    }
    else{
      this.title = "Edit Channel";
      this.groupForm.get('channelName').setValue(this.selectedChannel.name);
    }
    this.getAllFormat();
  }

  isMember=(id)=>{
    let available=false;
    this.selectedChannel.formats.forEach(format => {
      if(format.id==id){
        available=true;
      }
    });
    return available;
  }

  hideChannelModal=()=>{
    if(this.groupForm.get('channelName').value || this.selectedChannel.formats.length !== 0){      
      if(confirm("Do you want to save the changes ?")){
        this.saveChannel();
      }
      else{
        this.closeModalEvent.emit(false); 
      }
    }
    else{
      if (confirm("Incomplete form! Do you want to close it ?")) {
        this.closeModalEvent.emit(false);      
      }
      
    }
  }

  getAllFormat=()=>{
    this.httpService.callApi('getFormat', {}).subscribe((response) => {
      this.blockedPanel=false;
      this.formatList = response || [];
    }, error => {
      this.blockedPanel=false;
      this.toastr.error(error.error.message, 'Channel');
    });
  }

  saveChannel(){
    if(!this.groupForm.get('channelName').value || this.selectedChannel.formats.length === 0){
      if(!this.groupForm.get('channelName').value){
        this.toastr.error("Channel Name can not be empty.");
      }
      else{
        this.toastr.error("Please add atleast one format.");
      }
    }
    else{
        let message = '';
        if(this.selectedChannel.hasOwnProperty('id')){
          this.selectedChannel = {
            "id":this.selectedChannel.id,
            "name":this.groupForm.get('channelName').value,
            "formats":this.selectedChannel.formats,
          }
        }
        else{
          this.selectedChannel = {
            "name":this.groupForm.get('channelName').value,
            "formats":this.selectedChannel.formats,
          }
        }    

        this.httpService.callApi('saveOrUpdateChannel', {body:this.selectedChannel}).subscribe((response) => {
          this.blockedPanel=false;
          if(!this.selectedChannel.hasOwnProperty('id')){
            message = 'Added Successfully'
          }
          else{
            message = 'Updated Successfully'
          } 
          this.toastr.success(message, 'Channel');
          this.closeModalEvent.emit(false);
        }, error => {
          this.blockedPanel=false;
          this.toastr.error(error.error.message, 'Channel');
        });
      }
    }

    onChangeFormat=(format)=>{
      let id=format.id;
      let index;
      this.selectedChannel.formats.forEach((format,i) => {
        if(format.id==id){
          index=i;
        }
      });

      if(index>=0){
        this.selectedChannel.formats.splice(index,1);
      }
      else{
        this.selectedChannel.formats.push(format);
      }
      
  }

  deleteChannel=(channelId)=>{
    this.showDeleteModal=true;
    this.channelDetail=channelId;
  }

  deleteChannelData=($event)=>{
    if($event){
      this.httpService.callApi('deleteChannel', {pathVariable:'/'+this.channelDetail}).subscribe((response) => {
        this.blockedPanel=false;
            
        this.toastr.success("Deleted Successfully", 'Channel');
        this.delete = false;
        this.closeModalEvent.emit(false);
      }, error => {
        this.blockedPanel=false;
        this.toastr.error(error.error.message, 'Channel');
      });
    }
    else
      this.closeModalEvent.emit(false); 
  }
  closeDeleteConfirmModal($event){
    this.showDeleteModal=$event;
  }

  
}