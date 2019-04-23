import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../core/services/http.service';
import { CommonUtilService } from '../core/services/common-util-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { forkJoin } from "rxjs/observable/forkJoin";
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-create-project-budgeting',
  templateUrl: './create-project-budgeting.component.html',
  styleUrls: ['./create-project-budgeting.component.scss']
})
export class CreateProjectBudgetingComponent implements OnInit {
  @Input() componentName='Project';
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @Input() projectDetail: any;
  @Input() isBooking: any=false;
  @Input() isApproved:any=false;
  public mask = [ /[0-2]/, /[0-3]/, ':', /[0-5]/, /[0-9]/]
  selectedStep: number = 1;
  budgetingForm: FormGroup;
  dropdownData: any = [];
  dropdownDataAPI: any;
  extraDropdownData: any = [];
  extraDropdownDataAPI: any = [];
  channelFormat: any=[];
  milestones: any = [];
  selectedCustomer: any;
  selectedChannel : any;
  contacts: any = [];
  attachments: any = [];
  removedAttachments: any = [];
  managedByAPI: any;
  addedAttachmentFileName: string;
  allowedExtensionsForAttachment = ['jpg', 'png', 'pdf'];
  invalidAttachmentFormatError: string;
  modalHeading = "Create Project";
  contactDropDown: any = [];
  formatDropDown: any = [];
  blockedPanel: boolean = false;
  canNotModifyProjectDetail:boolean=false;
  projectSatusDropdown:any=[];
  projectFinancialSatusDropdown:any=[];
  isBookingInprogessAndApproved:boolean=false;
  disableAttachment:boolean=false;
 responseMessage:string='Project';
 selectedColor: string = '#161514';
 isShowSelected:boolean=false;
 showDeleteModal:boolean=false;

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private commonUtilService: CommonUtilService, private toastr: ToastrService, private router: Router) { }


  ngOnInit() {
  
    this.dropdownDataAPI = this.httpService.callApi('getProjectDropdown', {});
    this.extraDropdownDataAPI = this.httpService.callApi('getPersonalDropdownData', {});
    this.blockedPanel=true;
    this.loadData(() => {
    
      if (this.projectDetail) {
        this.responseMessage= this.isBooking?'Booking':'Budget';
        this.modalHeading = this.isBooking?'Edit Booking':'Edit Budget';
        this.getStatusDropDown(this.projectDetail.financialStatus);
        this.modifyProjectDetailUpdate();
        this.disableAttachment =  this.projectDetail && this.projectDetail.recordDiscriminator=="budget" && this.projectDetail.status!='Done' && this.projectDetail.financialStatus=='Rejected';
        this.createFormGroupForEdit((form) => {
          this.budgetingForm = form;
          this.contactDropDown=this.projectDetail.company?this.projectDetail.company.contacts:[];
          this.formatDropDown=this.projectDetail.channel?this.projectDetail.channel.formats:[];
          this.milestones = this.projectDetail.dueDates;
          this.attachments =this.projectDetail.attachments;
          this.contacts = this.projectDetail.recordContacts ? this.projectDetail.recordContacts : [];
          this.selectedCustomer = this.projectDetail.company ? this.projectDetail.company : null;
          if(this.projectDetail.channelFormat){
            this.channelFormat=this.projectDetail.channelFormat;
          }

          this.onChangeTheme()
         
        });


        this.selectedColor = this.projectDetail.theme ? this.projectDetail.theme : '#161514';
       
      } else {
        if(this.isBooking){
          this.projectSatusDropdown=['In Progress','Archived'];
        this.projectFinancialSatusDropdown=['Approved','Revised'];
       }else{
        this.projectSatusDropdown=['To Do','In Progress','Done','Archived'];
        this.projectFinancialSatusDropdown=['Approved','Revised','Rejected'];
       }
        this.budgetingForm = this.createFormGroup();
        this.canNotModifyProjectDetail=false;

      }

      this.budgetingForm.get('projectInfo').get('duration').valueChanges.subscribe((value)=>{
        let arr=value.split(':');
        let str=arr[0];
        let subStr=str.substr(0,1);
        if(subStr=='2')
         this.mask= [ /[0-2]/, /[0-3]/, ':', /[0-5]/, /[0-9]/];
         else
         this.mask= [ /[0-2]/, /[0-9]/, ':', /[0-5]/, /[0-9]/];
    })
      this.budgetingForm.get('attachment').get('feedByUrl').valueChanges.subscribe(

        (feedByUrl) => {
          if (feedByUrl == '1') {
            this.budgetingForm.get('attachment').get('url').enable();
            this.budgetingForm.get('attachment').get('url').setValidators(Validators.compose([Validators.required, Validators.pattern('(https://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?|(http://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]));

            this.budgetingForm.get('attachment').get('avatar').disable();
            this.budgetingForm.get('attachment').get('avatar').clearValidators();
          } else {
            this.budgetingForm.get('attachment').get('url').disable();
            this.budgetingForm.get('attachment').get('url').clearValidators();

            this.budgetingForm.get('attachment').get('avatar').enable();
            this.budgetingForm.get('attachment').get('avatar').setValidators(Validators.required);
          }
          this.budgetingForm.get('attachment').get('url').updateValueAndValidity();
          this.budgetingForm.get('attachment').get('avatar').updateValueAndValidity();
        });
   

      this.budgetingForm.get('projectInfo').get('customer').valueChanges.subscribe((value) => {
        this.contacts=[];
        this.selectedCustomer = value;
        this.getContactDropdown();
      });
      this.budgetingForm.get('milestones').get('selectedChannel').valueChanges.subscribe((value) => {
        this.selectedChannel = value;
        this.getFormatDropdown();
      });
      this.budgetingForm.get('projectInfo').get('financialStatus').valueChanges.subscribe((value) => {
        this.getStatusDropDown(value);
      });
      this.blockedPanel=false;
    });

    this.onChangeTheme()

  }

  showInLocal(date){
    let formatedDate="";
    formatedDate=moment(date).format("MM/DD/YY")
    return formatedDate;
  }

  private loadData(cb) {
    forkJoin([this.dropdownDataAPI, this.extraDropdownDataAPI,]).subscribe(resultList => {
      this.dropdownData = resultList[0];
      this.extraDropdownData = resultList[1];
      
      if(this.projectDetail&&this.projectDetail.dueDates){
        this.dropdownData.milestones = this.dropdownData.milestones.filter(dt => {
          let contains: boolean = true;
         
          this.projectDetail.dueDates.forEach(element => {
            if (dt === element.type) {
              contains = false;
              return contains;
            }
  
          })
          return contains;
        });
      }

      if(this.projectDetail&&this.projectDetail.channelFormat) {
        this.dropdownData.channels = this.dropdownData.channels.filter(dt => {
          let contains: boolean = true;
          this.projectDetail.channelFormat.forEach(element => {
            if (element.channel && dt.id == element.channel.id) {
              contains = false;
              return contains;
            }
          })
          return contains;
        });
      }
     
      if (this.projectDetail) {
        this.contacts = this.projectDetail.contacts;
      }
      cb();
    }, (errorList) => {
      console.log('Error[0] ', errorList[0]);
      console.log('Error[0] ', errorList[1]);
      cb();
    });
  }

getStatusDropDown(status:string){
if(status){
  if(this.isBooking){
    if(this.projectDetail && status=='Approved'){
      this.projectSatusDropdown=['In Progress','Done','Archived'];
    }else{
      this.projectSatusDropdown=['In Progress','Archived'];
    }
    this.projectFinancialSatusDropdown=['Approved','Revised'];
  }else{
    this.projectSatusDropdown=['To Do','In Progress','Done','Archived'];
    this.projectFinancialSatusDropdown=['Approved','Revised','Rejected'];
  }
}else{
  if(this.isBooking){
      this.projectSatusDropdown=['In Progress','Archived'];
    this.projectFinancialSatusDropdown=['Approved','Revised'];
  }else{
    this.projectSatusDropdown=['To Do','In Progress','Done','Archived'];
    this.projectFinancialSatusDropdown=['Approved','Revised','Rejected'];
  }
}
 
}
  modifyProjectDetailUpdate(){
    if(this.projectDetail.recordDiscriminator=='booking'){
      if(this.projectDetail.status=='Done' && this.projectDetail.financialStatus=='Approved' ){
        this.canNotModifyProjectDetail=true;
      }
      if(this.projectDetail.status=='In Progress' && this.projectDetail.financialStatus=='Approved'  ){
        this.isBookingInprogessAndApproved=true;
      }
    }else{
      if(this.projectDetail.status=='Done' && this.projectDetail.financialStatus=='Approved' ){
        this.canNotModifyProjectDetail=true;
      }

      if(this.projectDetail.status!='Done' && this.projectDetail.financialStatus=='Rejected' ){
        this.canNotModifyProjectDetail=true;
      }
      if( this.projectDetail.financialStatus=='Approved' ){
        this.canNotModifyProjectDetail=true;
        this.isBookingInprogessAndApproved=true;
      }
    }

  }
  /*--To close modal on edit page */
  closeProjectEditModal() {
    this.closeModalEvent.emit(false);
  }

  setSelectedStep(stepNumber: number) {
    this.selectedStep = stepNumber;
  }

  /*-To send an event to list and edit parent components on close modal. -*/
  sendCloseEventToEditOrListComponent() {
    if (this.budgetingForm.get('projectInfo').invalid) {
      if (confirm("Incomplete form, Are sure to close it without saving?")) {
        this.closeModalEvent.emit(false);
      }
    }
    else {
    if (confirm("Are you sure to close and save?")) {
      this.saveProject();
    } else {
      this.closeModalEvent.emit(false);
    }
  }
}

  /*-  To create from for new equipment. */
  createFormGroup(): FormGroup {
    if(this.dropdownData.saleEntities.length === 1){
      this.projectDetail = {};
      this.projectDetail.saleEntity = {};
    this.projectDetail.saleEntity = this.dropdownData.saleEntities[0];
    //  console.log(this.projectDetail, this.dropdownData, this.projectDetail.saleEntity?this.projectDetail.saleEntity.id:0)
    }
    return this.formBuilder.group({
      projectInfo: this.formBuilder.group({
        projectStatus: ['To Do'],
        financialStatus: [null],
        customer: [null],
        title: [null,Validators.required],
        show: [null],
        category: [null],
        duration: [null],
        version: [null],
        city: [null],
        country: [null],

      }),
      contacts: this.formBuilder.group({
        selectedContact: [null,Validators.required]
      }),
      milestones: this.formBuilder.group({
        milestoneType: [null, Validators.required],
        milestoneDate: [null,Validators.required],
        selectedChannel: [null,Validators.required],
        selectedChannelFormat: [null, Validators.required]

      }),


      attachment: this.formBuilder.group({
        attachmentType: [null, Validators.required],
        feedByUrl: '',
        avatar: [null, Validators.required],
        url: [{ value: null, disabled: true }]
      }),


      others: this.formBuilder.group({
        projectNumber: [null],
        projectDate: [new Date()],
        managedBy: [0],
        origin: [null],
        currency: [null],
        businessUnit: [this.projectDetail && this.projectDetail.saleEntity?this.projectDetail.saleEntity.id:0],
        internalRefrence: [null],
        externalRefrence: [null],
        language: [null],
        comment: [null]

      })

    });
  }
  /*-  To create from for edit */
  createFormGroupForEdit(cb) {    
   let isProjetStatusDone= this.projectDetail.status=='Done' && this.projectDetail.financialStatus=='Approved';
   if(this.dropdownData.saleEntities.length === 1){    
    this.projectDetail.saleEntity = this.dropdownData.saleEntities[0];
    // console.log(this.projectDetail, this.dropdownData, this.projectDetail.saleEntity?this.projectDetail.saleEntity.id:0)
   }
    let fg: FormGroup = this.formBuilder.group({
      projectInfo: this.formBuilder.group({
        projectStatus: [{value:this.projectDetail.status ? this.projectDetail.status : 'To Do',disabled:isProjetStatusDone}],
        financialStatus: [{value:this.projectDetail.financialStatus ? this.projectDetail.financialStatus : null,disabled:isProjetStatusDone}],
        customer: [{value:this.projectDetail.company ? this.projectDetail.company.id : null,disabled:this.isBookingInprogessAndApproved||(this.projectDetail && this.canNotModifyProjectDetail)}],
        title: [{value:this.projectDetail.title,disabled:isProjetStatusDone},Validators.required],
        show: [{value:this.projectDetail.program ? this.projectDetail.program.id : null,disabled:this.isBookingInprogessAndApproved||(this.projectDetail && this.canNotModifyProjectDetail)}],
        category: [{value:this.projectDetail.category ? this.projectDetail.category : null,disabled:this.isBookingInprogessAndApproved||(this.projectDetail && this.canNotModifyProjectDetail)}],
        duration: [{value:this.projectDetail.information ? this.projectDetail.information.length : '',disabled:this.isBookingInprogessAndApproved||(this.projectDetail && this.canNotModifyProjectDetail)}],
        version: [{value:this.projectDetail.information ? this.projectDetail.information.version : '',disabled:this.isBookingInprogessAndApproved||(this.projectDetail && this.canNotModifyProjectDetail)}],
        city: [{value:this.projectDetail.city,disabled:this.isBookingInprogessAndApproved||(this.projectDetail && this.canNotModifyProjectDetail)}],
        country: [{value:this.projectDetail.country?this.projectDetail.country:null,disabled:this.isBookingInprogessAndApproved||(this.projectDetail && this.canNotModifyProjectDetail)}],
      }),

      contacts: this.formBuilder.group({
        selectedContact: [null,Validators.required]
      }),

      milestones: this.formBuilder.group({
        milestoneType: [{value:null,disabled: this.canNotModifyProjectDetail}, Validators.required],
        milestoneDate: [{value:null,disabled: this.canNotModifyProjectDetail},Validators.required],
        selectedChannel: [this.projectDetail.channel ? this.projectDetail.channel : null,Validators.required],
        selectedChannelFormat: [null, Validators.required]
      }),

      attachment: this.formBuilder.group({
        attachmentType: [{value:null,disabled:this.disableAttachment}, Validators.required],
        feedByUrl: [{value:'',disabled:this.disableAttachment}],
        avatar: [{value:null,disabled:this.disableAttachment}, Validators.required],
        url: [{ value: null, disabled: true }]
      }),

      others: this.formBuilder.group({
        projectNumber: [null],
       
        managedBy: [this.projectDetail.follower ? this.projectDetail.follower.id : 0],
        origin: [this.projectDetail.origin],
        projectDate:[this.projectDetail.date?new Date(this.projectDetail.date):new Date()],
        currency: [this.projectDetail.currency?this.projectDetail.currency:null],
        businessUnit: [this.projectDetail.saleEntity?this.projectDetail.saleEntity.id:0],
        internalRefrence: [this.projectDetail.referenceInternal],
        externalRefrence: [this.projectDetail.referenceExternal],
        language: [this.projectDetail.language],
        comment: [this.projectDetail.information?this.projectDetail.information.comment:'']

      })


    });
    
    cb(fg);
  }

  /*-  To create JSON for saving equipment.*/
  getJSONForSaveBudgeting(): any {
    let id = null;
    let version = null;
    if (this.projectDetail) {
      id = this.projectDetail.id;
      version = this.projectDetail.version;
    }
    let follower=this.dropdownData.followers?this.dropdownData.followers.filter(el=>el.id==this.budgetingForm.get('others').get('managedBy').value)[0]:null;
    let saleEntity =this.dropdownData.saleEntities ? this.dropdownData.saleEntities.filter(el => el.id == this.budgetingForm.get('others').get('businessUnit').value)[0] : null;
    let show= this.dropdownData.programs.find(dt=>dt.id==this.budgetingForm.get('projectInfo').get('show').value);
    let customer= this.dropdownData.clients.find(dt=>dt.id==this.budgetingForm.get('projectInfo').get('customer').value);
    let budgetingData = {
      "id": id,
      "version": version,
      "country": this.budgetingForm.get('projectInfo').get('country').value,
      "city": this.budgetingForm.get('projectInfo').get('city').value,
      "title": this.budgetingForm.get('projectInfo').get('title').value,
      "status": this.budgetingForm.get('projectInfo').get('projectStatus').value,
      "company": customer,
      "category": this.budgetingForm.get('projectInfo').get('category').value,
      "financialStatus": this.budgetingForm.get('projectInfo').get('financialStatus').value!='null'?this.budgetingForm.get('projectInfo').get('financialStatus').value:null,
      "information": {
        "version": this.budgetingForm.get('projectInfo').get('version').value,
        "length": this.budgetingForm.get('projectInfo').get('duration').value,
        "comment": this.budgetingForm.get('others').get('comment').value,
      },
      "program": show?{"id":show.id}:null,
      "channelFormat": this.channelFormat,
      "dueDates": this.milestones,
      "currency": this.budgetingForm.get('others').get('currency').value,
      "localeLanguage": this.budgetingForm.get('others').get('language').value,

      "recordContacts": this.contacts,
      "referenceInternal": this.budgetingForm.get('others').get('internalRefrence').value,
      "referenceExternal": this.budgetingForm.get('others').get('externalRefrence').value,
      "lines": this.projectDetail && this.projectDetail.lines ? this.projectDetail.lines : null,
      "date":this.budgetingForm.get('others').get('projectDate').value?moment(this.budgetingForm.get('others').get('projectDate').value).tz("Asia/Calcutta").format():null,
      "follower": follower?{ 'id': follower.id }:null,
      "saleEntity":saleEntity?{"id":saleEntity.id}:null, 
      "theme":this.selectedColor,
      "origin": this.budgetingForm.get('others').get('origin').value
      
    }
    return budgetingData;

  }

  /*-  To save equipment*/
  saveProject() {    
    let projectDiscriminator = this.isBooking ? "Booking" : "Budget";
    let title = this.budgetingForm.get('projectInfo').get('title').value,
    companyName = this.budgetingForm.get('others').get('businessUnit').value;
    if (title && title !== '') {
      if (companyName && companyName !== ''){
        this.saveURLProject()
      }
      else {
        this.toastr.error("Please assign company", projectDiscriminator);
      }
    }
    else {
      let errorMessage = this.isBooking ? "Please provide a valid booking title" : "Please provide a valid budget title";
      this.toastr.error(errorMessage, projectDiscriminator);
    }    
  }

  saveURLProject(){
    let body = this.getJSONForSaveBudgeting();
    let saveUrl =this.isBooking?'saveProject':'saveBudget';
    this.httpService.callApi(saveUrl, { body: body }).subscribe((response) => {
      // this.toastr.success("Successfully saved", 'Bugeting');
      let projectDetail =response;
      this.saveAttachment(projectDetail.id, 0);
     
    }, error => {
      this.toastr.error(error.error.message, this.responseMessage);
      console.log('Error getstatus => ', error)
    });
  }


  onChangeTheme=() =>{    
    try{

      if(this.budgetingForm){
        let themeId = this.budgetingForm.get('projectInfo').get('show').value;

        if(themeId != undefined && themeId != null ){
          this.isShowSelected = true;
          this.selectedColor  = '';
          let newColor = '';
          
          this.dropdownData.programs.forEach(program => {
            if(program.id == themeId) {
              newColor = program.theme;
            }
          });
          this.selectedColor = newColor;
          console.log("========>",this.selectedColor)

        } else {
          this.isShowSelected = false;
          this.selectedColor='#161514';
        }
      }
      else {
        this.isShowSelected = false;
        this.selectedColor='#161514';
      }

    }
    catch(err){
      console.log(err)
    }

    
  }

  /*-  To handle event on FileChange for attachments*/
  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let fileExtension = file.name.split('.').pop().toLowerCase();

      if (this.isInArray(this.allowedExtensionsForAttachment, fileExtension) && file.size < 2097152) {
        this.invalidAttachmentFormatError = null;
        this.budgetingForm.get('attachment').get('avatar').setValue(file);
        this.addedAttachmentFileName = "Successfully added File:" + file.name;
      } else if (file.size > 2097152) {
        this.addedAttachmentFileName = null;
        this.budgetingForm.get('attachment').get('avatar').setValue(null);
        this.invalidAttachmentFormatError = "File size should not be greater than 2MB."
      }
      else {
        this.addedAttachmentFileName = null;
        this.budgetingForm.get('attachment').get('avatar').setValue(null);
        this.invalidAttachmentFormatError = "Only jpg or jpeg or pdf format allowed!!"
      }


    }
  }

  /*- checks if word exists in array -*/
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  /*-To Add different values for Email,Telephone,Function,Skill,Language,Attachment,Role,Group,Document-*/
  addContents(addTo: string) {
    switch (addTo) {

      case 'Milestone':
        {
          let milestoneType = this.budgetingForm.get('milestones').get('milestoneType').value;
          let milestoneDate = this.budgetingForm.get('milestones').get('milestoneDate').value
          this.milestones.push({
            "type": milestoneType,
            "dueDate":  moment(milestoneDate).tz("Asia/Calcutta").format()
          });
          this.dropdownData.milestones.splice(this.dropdownData.milestones.indexOf(milestoneType), 1);
          this.budgetingForm.get('milestones').get('milestoneType').reset();
          this.budgetingForm.get('milestones').get('milestoneDate').reset();

          break;
        }
        case 'Channel':{
          let channel = this.budgetingForm.get('milestones').get('selectedChannel').value;
          let format = this.budgetingForm.get('milestones').get('selectedChannelFormat').value;
          this.channelFormat.push({"channel":channel,"format":format});
          this.dropdownData.channels.splice(this.dropdownData.channels.indexOf(channel), 1);
          this.budgetingForm.get('milestones').get('selectedChannel').reset();
          this.budgetingForm.get('milestones').get('selectedChannelFormat').reset();
          this.formatDropDown = [];
          break;
          }
      case 'Contact':
        {
          let contact = this.budgetingForm.get('contacts').get('selectedContact').value;
          this.contacts.push(contact);
          this.budgetingForm.get('contacts').get('selectedContact').reset();
          break;

        }
      case 'Attachment':
        {
          let fileExtention = '';
          if (!this.budgetingForm.get('attachment').get('feedByUrl').value) {
            fileExtention = this.budgetingForm.get('attachment').get('avatar').value.name.split('.').pop().toLowerCase();
          }
          this.attachments.push({ 'type': this.budgetingForm.get('attachment').get('attachmentType').value, 'extension': fileExtention, 'feedByUrl': this.budgetingForm.get('attachment').get('feedByUrl').value ? 'true' : 'false', 'avatar': this.budgetingForm.get('attachment').get(this.budgetingForm.get('attachment').get('feedByUrl').value ? 'url' : 'avatar').value })
          this.budgetingForm.get('attachment').reset();
          this.addedAttachmentFileName = null;
          break;
        }
    }

  }

  removeContents(obj: any, removeFrom: String) {
    switch (removeFrom) {

      case 'Milestone':
        {
          this.milestones.splice(this.milestones.indexOf(obj), 1);
          this.dropdownData.milestones.push(obj.type);
          break;
        }
      case 'Contacts':
        {
          this.contacts.splice(this.contacts.indexOf(obj), 1);
          break;

        }
      case 'Attachment':
        {
          if (obj.id) {
            this.removedAttachments.push(obj.id);
          }
          this.attachments.splice(this.attachments.indexOf(obj), 1);
          break;
        }
      case 'Channel':{
        this.channelFormat.splice(this.channelFormat.indexOf(obj), 1);
        this.dropdownData.channels.push(obj.channel);
        break;
      }
    }

  }
  clearSpace(form, fieldName) {
    if(form&&fieldName){
      form.get(fieldName).setValue(form.get(fieldName).value.trim());
    }
   
  }

  getAttachmentImage(attachment) {
    let imageUrl = '';
    if (attachment.feedByUrl.toString() == 'true') {
      imageUrl = '../../assets/img/url.png';
    } else if (attachment.extension == 'pdf') {
      imageUrl = '../../assets/img/pdf_logo.jpg';
    } else {
      imageUrl = '../../assets/img/image_icon.png';
    }
    return imageUrl;
  }

  getContactDropdown() {
    this.dropdownData.clients.forEach(client => {
      if (client.id == this.selectedCustomer) {
        this.contactDropDown = client.contacts;
      }
    });
  }

  getFormatDropdown() {
    this.formatDropDown = [];
    let channelSelected = this.budgetingForm.get('milestones').get('selectedChannel').value;
    if(channelSelected){
        channelSelected.formats.forEach(format => {
          this.formatDropDown.push(format.name);
      });
    }else{
      this.formatDropDown =[];
    }
  }

  /*-  To upload attachments*/
  saveAttachment(budgetId: number, index: number): string {
   
    if (index >= this.attachments.length) {
      if (this.removedAttachments.length > 0) {
        this.deleteAttcahments();
      } else {
        this.closeModalEvent.emit(false);
        this.toastr.success('Successfully Saved', this.responseMessage);
      }
    
      return;
    }
    let element = this.attachments[index];
    if (!element.id) {
      let body = new FormData();
      body.append(element.feedByUrl == 'true' ? 'url' : 'fileContent', element.avatar);
      body.append('attachmentType', element.type);
      body.append('isFeedByUrl', element.feedByUrl);
      body.append('discriminator', 'budget');
      this.httpService.callApi("uploadAttachment", { body: body, pathVariable: budgetId }).subscribe((respone) => {

        this.saveAttachment(budgetId, ++index);
      }, (error) => {

        this.toastr.error(error.error.message, this.responseMessage);
        console.log('error ', error)
      });
    } else {

      this.saveAttachment(budgetId, ++index);
    }
  }
  deleteAttcahments() {
    let pathVariable: string = '/' + this.projectDetail.id + '/budget';
    this.httpService.callApi("deleteAttachments", { pathVariable: pathVariable, body: this.removedAttachments }).subscribe((responce) => {
      this.toastr.success('Successfully Saved', this.responseMessage);
      //this.closeModalEvent.emit(false);
    }, (error) => {

    });
  }

  deleteProject($event){
    if($event){
      let deleteUrl=this.projectDetail.recordDiscriminator==='budget'?'deleteBudget':'deleteProject';

      this.httpService.callApi(deleteUrl, { pathVariable: this.projectDetail.id}).subscribe((responce) => {
        this.toastr.success('Successfully Deleted', this.responseMessage);
        this.closeModalEvent.emit(false);
        this.router.navigate(['/teamium/project-list']);
      }, (error) => {
        this.toastr.error('Error while deletion' + error.error.message, this.responseMessage);
    console.log(error.error.message)
      });
    }
    
  }
  closeDeleteConfirmModal($event){
    this.showDeleteModal=$event;
  }
}
