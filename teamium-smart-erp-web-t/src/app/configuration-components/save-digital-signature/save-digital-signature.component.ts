import { Component, OnInit, Input, Output,EventEmitter, HostListener, ElementRef  } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { fork } from 'cluster';
import { forkJoin } from "rxjs/observable/forkJoin";
import { UiSwitchModule } from 'ngx-toggle-switch';
import { FormGroup, FormBuilder, Validators, FormArray } from '../../../../node_modules/@angular/forms';
import { TouchSequence } from 'selenium-webdriver';


@Component({
  selector: 'app-save-signature',
  templateUrl: './save-digital-signature.component.html',
  styleUrls: ['./save-digital-signature.component.scss']
})
export class SaveDigitalSignature implements OnInit {
  blockedPanel:boolean=false;
  @Input() componentName='Signature';
  @Input() selectedSignature: any;
  @Output() closeModalEvent=new EventEmitter<boolean>();

  templateForm:any;
  staffList:any = [];
  showTemplateText:boolean=false;
  approved:boolean = false;
  openList:boolean = false;
  templateName:any;
  email:any;
  name:any;
  delete:boolean= false;
  deleteData:any;
  deleteIndex:any;
  order:any;
  line:any;
  showRecipient:boolean = false;
  personnelName:any = "Select Personnel";
  openPersonnel:any={};
  searchText:any={};
  personnelId:any;
  searchTextRecipient:any;
  recipient:boolean=false;
  checkRoutingOrder:boolean=false;
  duplicateRoutingOrder:boolean = false;
  duplicateRecipient:boolean = false;
  showDeleteModal:boolean=false;
  templateNameList:any=[];
  constructor(private _elementRef:ElementRef,private httpService:HttpService, private toastr: ToastrService, private formBuilder:FormBuilder){
    this.templateForm= this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      templateName:[null],
      email:[null],
      order:[null],
    })
  }

  @HostListener('document:click', ['$event.target'])
  onClickedOutside(targetElement) {
    if (!targetElement.closest('.searchPeraonnel')) {
      this.openList = false;
      Object.keys(this.openPersonnel).forEach(key=>{
        this.openPersonnel[key]=false;
      })
    }
  }

  ngOnInit(){
    let email, recipientId;
    if(this.selectedSignature.hasOwnProperty('id')){
    }
    else{
      this.selectedSignature["signatureRecipientDTOs"] = [];
    }
    this.name = this.selectedSignature.name;
    this.templateName = this.selectedSignature.templateName;
    this.getAllTemplateData();
  } 
  
  openStaffDropdown(index){
    if(this.openList){
      this.openList = false;
    }
    Object.keys(this.openPersonnel).forEach(key=>{
      this.openPersonnel[key]=false;
    })
    this.openPersonnel[index] = true;
  }

  getStaffData(staffData, index){
    if(staffData !== 'selectPersonnel'){
      this.selectedSignature.signatureRecipientDTOs[index].recipient = staffData;      
    }
    else{
      delete this.selectedSignature.signatureRecipientDTOs[index]['recipient'] ;
    }
    this.openPersonnel[index] = false;
    this.recipient = false;
  }

  hideSignatureModal() {
    if (confirm("Are you sure to close and save?")) {
      this.save();
    } else {
      this.duplicateRoutingOrder = false;
      this.duplicateRecipient = false;
      this.checkRoutingOrder = false;
      this.closeModalEvent.emit(false);
    }
  }

  getAllTemplateData(){
    let getAllTemplates = this.httpService.callApi('getTeamplateData', {});
    let getPersonals = this.httpService.callApi('getAvailablePersonals', {});
    let getAllSignaturedData = this.httpService.callApi('getSignatureData',{});
    forkJoin([getAllTemplates, getPersonals, getAllSignaturedData]).subscribe((response) => {
      this.blockedPanel=false;
      this.templateNameList = response[0] || [];
      this.staffList = response[1] || [];
      let signatureData = response[2] || [];
      let contains: boolean = true;
      this.templateNameList = this.templateNameList.filter(dt => {
        let contains: boolean = true;
        signatureData.forEach(element => {
          if (dt.templateName == element.templateName && this.selectedSignature.templateName !== element.templateName) {
            contains = false;
            return contains;
          }
        })
        return contains;
      });
    }, error => {
      console.log('Error getstatus => ', error)
    });
  }

  approve(approve){ 
    if(approve){
      let selectSignature = this.selectedSignature.signatureRecipientDTOs;
      for(var i=0;i<selectSignature.length;i++){
        if(selectSignature[i].id === approve.id){
          this.selectedSignature.signatureRecipientDTOs[i].approvalRequired = !approve.approvalRequired;
        }
      }
    }
    else{   
      this.approved = !this.approved;
    }
  }

  getEmailData(recipients){
    if(recipients.hasOwnProperty('recipient')){
      if(recipients.recipient.hasOwnProperty('id')){
        if(recipients.recipient.hasOwnProperty('userSettingDTO')){
          if(recipients.recipient.userSettingDTO.hasOwnProperty('emails') !== undefined){
            let emails = recipients.recipient.userSettingDTO.emails;
            for(var i =0; i<emails.length; i++){
              if(emails[i].primaryEmail)
                return emails[i].email;
            }
          }
          else{
            return 'Primary Email';
          }
        }
        else{
          return 'Primary Email';
        }
      }
      else{
        return 'Primary Email';
      }
    }
  }

  addRecipient(){
    let newRecipient;
    if(this.showRecipient){   
      if(this.personnelId) {
        let newRecipient = {
          recipient:this.personnelId,
          approvalRequired:this.approved,
          routingOrder:this.order
        }
        this.selectedSignature.signatureRecipientDTOs.push(newRecipient);
        this.personnelId = undefined;
        this.personnelName = 'Select Personnel';
        this.approved = false;
        this.order = undefined;
      }
      else{
        this.toastr.error("Please select personnel");
      } 
     
    }
    else{
      this.showRecipient = true;
    }
  }

  getPersonnelName(recipient, index){
    if(index !== null){
      this.personnelId= recipient;
      this.personnelName = recipient.firstName+" "+recipient.lastName;
    }
    else{
      this.personnelName = 'Select Personnel';
      this.personnelId = undefined;
    }
    this.openList=false;
  }

  save=()=>{
    if(this.duplicateRoutingOrder) {
      this.toastr.error("Cannot save due to duplicate routing order", 'Signature Delegation');
    } else if(this.duplicateRecipient) {
      this.toastr.error("Cannot save due to duplicate recipient", 'Signature Delegation');
    } else {
    for(var i=0;i<this.selectedSignature.signatureRecipientDTOs.length;i++){
      var elm = this.selectedSignature.signatureRecipientDTOs[i];
      if(!elm.hasOwnProperty('recipient')){
        this.recipient = true;
      }
      if(!elm.hasOwnProperty('routingOrder')){
        this.checkRoutingOrder = true;
      }     
    }
    if(this.recipient){
      this.toastr.warning("Personnel can not be empty");
    }
    else if(this.checkRoutingOrder) {
      this.toastr.warning("Routing order can not be empty");
    }
    else {
      let obj, newRecipient;
      if(this.personnelId){
        newRecipient = [{
          recipient:this.personnelId 
          ,
          "routingOrder": this.order || '',
          "approvalRequired": this.approved
        },...this.selectedSignature.signatureRecipientDTOs]
      }
      else{
        newRecipient = [...this.selectedSignature.signatureRecipientDTOs]
      }


      if(this.selectedSignature.hasOwnProperty('id')){
        obj = {
          "id":this.selectedSignature.id,
          "name": this.name,
          "templateName": this.templateName,
          "signatureRecipientDTOs": newRecipient
        }
      }
      else{
        obj = {
          "name": this.name,
          "templateName": this.templateName,
          "signatureRecipientDTOs": newRecipient
        }
      }
      if(obj != null) {
        let recipientsList = obj.signatureRecipientDTOs;
        for(var i=0; i<recipientsList.length; i++){
          var recipient = recipientsList[i];
          if(recipient.routingOrder == null || recipient.routingOrder == ''){
            this.checkRoutingOrder = true;
            break;
          }
        }
      }
      if(this.checkRoutingOrder){
        this.toastr.warning("Routing order can not be empty");
      } else if(this.templateNameList.length !== 0){
        this.duplicateRoutingOrder = false;
        this.checkRoutingOrder = false;
        this.httpService.callApi('saveSignatureData', {body:obj}).subscribe((response)=>{
          if(!this.selectedSignature.hasOwnProperty('id')){
            this.toastr.success('Added successfully');        
          }
          else{
            this.toastr.success('Updated successfully');
          }
          this.closeModalEvent.emit(false);
        },error=>{
          this.toastr.error(error.error.message);
        })
      }
      else{
        this.toastr.error("Please create template");
      }
    }
    }
    

      
      //     // if(this.templateNameList.length !== 0){
         
    //     // }
    //     // else{
    //     //   this.toastr.error("Please create template");
    //     // }
    //   }
    //   else{
    //     console.log("false");
    //     this.toastr.warning("Personnel can not be empty");
    //     return false;
    //   }


    // this.selectedSignature.signatureRecipientDTOs.forEach(elm=>{
    //   console.log("EMELMENT",elm);
    //   if(elm.hasOwnProperty('recipient')){
    //     console.log("true");
    //     this.recipient = false;
    //     return false;

    //     // let obj, newRecipient;
        // if(this.personnelId){
        //   newRecipient = [{
        //     recipient:{ ...this.personnelId }
        //     ,
        //     "routingOrder": this.order || '',
        //     "approvalRequired": this.approved
        //   },...this.selectedSignature.signatureRecipientDTOs]
          // console.log("YES",newRecipient);
    //     // }
    //     // else{
    //     //   newRecipient = [...this.selectedSignature.signatureRecipientDTOs]
    //     //   // console.log("NO",newRecipient);
    //     // }

    //     // if(this.selectedSignature.hasOwnProperty('id')){
    //     //   obj = {
    //     //     "id":this.selectedSignature.id,
    //     //     "name": this.name,
    //     //     "templateName": this.templateName,
    //     //     "signatureRecipientDTOs": newRecipient
    //     //   }
    //     // }
    //     // else{
    //     //   obj = {
    //     //     "name": this.name,
    //     //     "templateName": this.templateName,
    //     //     "signatureRecipientDTOs": newRecipient
    //     //   }
    //     // }

    //     // // console.log(obj);
    //     // if(this.templateNameList.length !== 0){
    //     //   this.httpService.callApi('saveSignatureData', {body:obj}).subscribe((response)=>{
    //     //     if(!this.selectedSignature.hasOwnProperty('id')){
    //     //       this.toastr.success('Added successfully');        
    //     //     }
    //     //     else{
    //     //       this.toastr.success('Updated successfully');
    //     //     }
    //     //     this.closeModalEvent.emit(false);
    //     //   },error=>{
    //     //     this.toastr.error(error.error.message);
    //     //   })
    //     // }
    //     // else{
    //     //   this.toastr.error("Please create template");
    //     // }
    //   }
    //   else{
    //     console.log("false");
    //     this.toastr.warning("Personnel can not be empty");
    //     return false;
    //   }
    // })

  }

  deleteModal(data, index){
    this.selectedSignature.signatureRecipientDTOs.splice(index,1);     
  }  

  deleteEnvelope($event){
    if($event){
      this.httpService.callApi("deleteEnvelope",{pathVariable:"/"+this.selectedSignature.id}).subscribe(response=>{
        this.toastr.success("Deleted Successfully",'Signature');
        this.closeModalEvent.emit(false);
      }, error=>{
        this.delete = false;
        this.toastr.error(error.error.message);
      })
    }
    
  }
  hideDeleteModal($event){
    this.showDeleteModal=$event;
  }
  onRoutingOrderChange(data, index) {
    if(data == 0) {
      this.toastr.error("Please enter value between 1 to 99", 'Signature Delegation');
    }
    if(index != null) {
      let signatureRecipient = this.selectedSignature.signatureRecipientDTOs[index];
      if(data == 0) {
        signatureRecipient.routingOrder = '';
      } else {
        // check for same value in list routing-order
        let recipientsList = this.selectedSignature.signatureRecipientDTOs;
        for(var i=0; i<recipientsList.length; i++){
          var recipient = recipientsList[i];
          if(i == index) {
            continue;
          } else if(recipient.routingOrder == signatureRecipient.routingOrder) {
            this.duplicateRoutingOrder = true;
          }
        }
      }

    } else if(this.order != null){

      if(this.order == 0){
        this.order = '';
      } else {
        // check for same value in list routing-order
        let recipientsList = this.selectedSignature.signatureRecipientDTOs;
        for(var i=0; i<recipientsList.length; i++){
          var recipient = recipientsList[i];
          if(this.order == recipient.routingOrder) {
            this.duplicateRoutingOrder = true;
          }
        }
      }
    }

    if(this.duplicateRoutingOrder) {
      this.toastr.error("Duplicate routing order", 'Signature Delegation');
    }
  }
  
}