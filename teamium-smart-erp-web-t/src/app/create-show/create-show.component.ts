
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../core/services/http.service';
import { CommonUtilService } from '../core/services/common-util-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { forkJoin } from "rxjs/observable/forkJoin";
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-create-show',
  templateUrl: './create-show.component.html',
  styleUrls: ['./create-show.component.scss']
})
export class CreateShowComponent implements OnInit {
  @Input() componentName='Show';
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @Input() projectDetail: any;
  @Input() isBooking: any = false;
  @Input() isApproved: any = false;
  public mask = [/[0-2]/, /[0-3]/, ':', /[0-5]/, /[0-9]/]
  selectedStep: number = 1;
  budgetingForm: FormGroup;
  dropdownData: any = [];
  dropdownDataAPI: any;
  extraDropdownData: any = [];
  extraDropdownDataAPI: any = [];
  channelFormat: any = [];
  milestones: any = [];
  selectedCustomer: any;
  contacts: any = [];
  attachments: any = [];
  removedAttachments: any = [];
  managedByAPI: any;
  addedAttachmentFileName: string;
  fileTarget: any;
  invalidAttachmentFormatError: string;
  modalHeading = "Create Show";
  contactDropDown: any = [];
  blockedPanel: boolean = false;
  canNotModifyProjectDetail: boolean = false;
  projectSatusDropdown: any = [];
  projectFinancialSatusDropdown: any = [];
  isBookingInprogessAndApproved: boolean = false;
  disableAttachment: boolean = false;
  responseMessage: string = 'Show';
  invalidPhotoFormatError: string = null;
  profilePictureName: string;
  pictureUrl: string;
  allowedExtensionsForPhoto = ['jpg', 'jpeg', 'png'];
  allowedExtensionsForAttachment = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'pdf'];
  selectedColor: string = '#161514';
  sessionChanged: boolean = true;
  isProjetStatusDone: boolean = false;
  yearError; string;
  addedPictureNameMessage : string;
  selectedChannel : any;
  formatDropDown: any = [];
  removeDocument : boolean = false;
  showDeleteModal:boolean=false;

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private commonUtilService: CommonUtilService, private toastr: ToastrService, private router: Router) { }


  ngOnInit() {
    this.responseMessage = 'Show';
    this.dropdownDataAPI = this.httpService.callApi('getProjectDropdown', {});
    this.extraDropdownDataAPI = this.httpService.callApi('getPersonalDropdownData', {});
    this.blockedPanel = true;
    this.loadData(() => {

      if (this.projectDetail) {
        this.getStatusDropDown(this.projectDetail.financialStatus);
        this.selectedColor = this.projectDetail.theme ? this.projectDetail.theme : '#161514';
        this.modifyProjectDetailUpdate();
        this.disableAttachment = this.projectDetail && this.projectDetail.recordDiscriminator == "budget" && this.projectDetail.status != 'Done' && this.projectDetail.financialStatus == 'Rejected';
        this.modalHeading = "Edit Show";
        this.pictureUrl = this.projectDetail.document != null ? this.projectDetail.document.url : '';
        this.createFormGroupForEdit((form) => {
          this.budgetingForm = form;
          this.contactDropDown = this.projectDetail.company ? this.projectDetail.company.contacts : [];
          this.milestones = this.projectDetail.dueDates;
          this.attachments = this.projectDetail.attachments;
          this.contacts = this.projectDetail.recordContacts ? this.projectDetail.recordContacts : [];
          this.formatDropDown=this.projectDetail.channel?this.projectDetail.channel.formats:[];
          this.selectedCustomer = this.projectDetail.company ? this.projectDetail.company : null;
          if (this.projectDetail.channelFormat) {
            this.channelFormat = this.projectDetail.channelFormat;
          }

        });

      } else {

        this.projectSatusDropdown = ['To Do', 'In Progress', 'Archived'];
        this.projectFinancialSatusDropdown = ['Approved', 'Revised', 'Rejected'];

        this.budgetingForm = this.createFormGroup();
        this.canNotModifyProjectDetail = false;

      }

      this.budgetingForm.get('projectInfo').get('minuteDuration').valueChanges.subscribe(value=>{
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
        this.contacts = [];
        this.selectedCustomer = value;
        this.getContactDropdown();
      });

      // this.budgetingForm.get('projectInfo').get('nbEpisodes').valueChanges.subscribe((value) => {
      //   this.calculateEpisode(this.budgetingForm.get('projectInfo').get('nbSessions').value, value);
      // }); 

      // this.budgetingForm.get('projectInfo').get('nbSessions').valueChanges.subscribe((value) => {

      //   this.calculateEpisode(value, this.budgetingForm.get('projectInfo').get('nbEpisodes').value);

      // });

      this.budgetingForm.get('milestones').get('selectedChannel').valueChanges.subscribe((value) => {
        this.selectedChannel = value;
        this.getFormatDropdown();
      });

      this.budgetingForm.get('projectInfo').get('financialStatus').valueChanges.subscribe((value) => {
        this.getStatusDropDown(value);
      });
      this.blockedPanel = false;
    });

  }

  updateSession = () => {
    // alert()
    this.calculateEpisode(this.budgetingForm.get('projectInfo').get('nbSessions').value, this.budgetingForm.get('projectInfo').get('nbEpisodes').value);
  }

  private loadData(cb) {
    forkJoin([this.dropdownDataAPI, this.extraDropdownDataAPI,]).subscribe(resultList => {
      this.dropdownData = resultList[0];
      this.extraDropdownData = resultList[1];
      if (this.projectDetail && this.projectDetail.dueDates) {
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

  getStatusDropDown(status: string) {
    if (status) {
      if (this.projectDetail && status == 'Approved') {
        this.projectSatusDropdown = ['To Do', 'In Progress', 'Done', 'Archived'];
      }
    } else {
      this.projectSatusDropdown = ['To Do', 'In Progress', 'Archived'];
    }
    this.projectFinancialSatusDropdown = ['Approved', 'Revised', 'Rejected'];
  }


  modifyProjectDetailUpdate() {

    if (this.projectDetail.financialStatus == 'Approved') {
      this.canNotModifyProjectDetail = true;
    }

    if (this.projectDetail.status != 'Done' && this.projectDetail.financialStatus == 'Rejected') {
      this.canNotModifyProjectDetail = true;
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
      if (confirm("Incomplete form! Do you want to close it ?")) {
        this.closeModalEvent.emit(false);
      }
    }
    else {
      if (confirm("Do you want to save the changes ?")) {
        this.saveShow();
      } else {
        this.closeModalEvent.emit(false);
      }
    }

  }

  /*-  To handle event on  ProfilePictureChange*/
  onProfilePictureChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let fileExtension = file.name.split('.').pop().toLowerCase();


      if (this.isInArray(this.allowedExtensionsForPhoto, fileExtension) && file.size < 2097152) {
        this.profilePictureName = file.name;
        this.addedPictureNameMessage = "Successfully added File : " + file.name;
        this.invalidPhotoFormatError = null;
        this.budgetingForm.get('projectInfo').get('avatar').setValue(file);
        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event) => { // called once readAsDataURL is completed
          let target: any = event.target; //<-- This (any) will tell compiler to shut up!
          this.pictureUrl = target.result;
        }
      }
      else if (file.size > 2097152) {
        this.profilePictureName = null;
        this.addedPictureNameMessage = null;
        this.budgetingForm.get('projectInfo').get('avatar').setValue(null);
        this.invalidPhotoFormatError = "File size should not be greater than 2MB."
      } else {
        this.profilePictureName = null;
        this.addedPictureNameMessage = null;
        this.budgetingForm.get('projectInfo').get('avatar').setValue(null);
        this.invalidPhotoFormatError = "Only jpg, jpeg or png format allowed!!"
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
        title: [null, Validators.required],
        reference: [null],
        season: [null],
        nbEpisodes: [null],
        nbSessions: [null],
        year: [null],
        minuteDuration: [null],

        avatar: [null],
      }),
      contacts: this.formBuilder.group({
        selectedContact: [null, Validators.required]
      }),
      milestones: this.formBuilder.group({

        selectedChannel: [null, Validators.required],
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
        start: [new Date()],
        managedBy: [0],
        analyticAccountNumber: [null],
        currency: [null],
        businessUnit: [this.projectDetail && this.projectDetail.saleEntity?this.projectDetail.saleEntity.id:0],
        language: [null],
        comment: [null]

      })

    });
  }
  /*-  To create from for edit */
  createFormGroupForEdit(cb) {

    let isProjetStatusDone = this.projectDetail.financialStatus == 'Approved';

    this.isProjetStatusDone = isProjetStatusDone;
    this.canNotModifyProjectDetail = isProjetStatusDone;
    if(this.dropdownData.saleEntities.length === 1){    
      this.projectDetail.saleEntity = this.dropdownData.saleEntities[0];
      // console.log(this.projectDetail, this.dropdownData, this.projectDetail.saleEntity?this.projectDetail.saleEntity.id:0)
     }
    let fg: FormGroup = this.formBuilder.group({
      projectInfo: this.formBuilder.group({
        projectStatus: [{ value: this.projectDetail.status ? this.projectDetail.status : 'To Do', disabled: isProjetStatusDone }],
        financialStatus: [{ value: this.projectDetail.financialStatus ? this.projectDetail.financialStatus : null, disabled: isProjetStatusDone }],
        customer: [{ value: this.projectDetail.company ? this.projectDetail.company.id : null, disabled: (this.projectDetail && this.canNotModifyProjectDetail) }],
        title: [{ value: this.projectDetail.title, disabled: isProjetStatusDone }, Validators.required],
        reference: [{ value: this.projectDetail.reference ? this.projectDetail.reference : this.projectDetail.id, disabled: isProjetStatusDone }],
        season: [{ value: this.projectDetail.season, disabled: isProjetStatusDone }],
        nbEpisodes: [{ value: this.projectDetail.nbEpisodes, disabled: isProjetStatusDone }],
        nbSessions: [{ value: this.projectDetail.nbSessions, disabled: isProjetStatusDone }],
        year: [{ value: this.projectDetail.year, disabled: isProjetStatusDone }],
        minuteDuration: [{ value: this.projectDetail.minuteDuration, disabled: isProjetStatusDone }],

        avatar: [{ value: null, disabled: isProjetStatusDone }],
      }),

      contacts: this.formBuilder.group({
        selectedContact: [null, Validators.required]
      }),
      milestones: this.formBuilder.group({


        selectedChannel: [null, Validators.required],
        selectedChannelFormat: [null, Validators.required]

      }),


      attachment: this.formBuilder.group({
        attachmentType: [{ value: null, disabled: this.disableAttachment }, Validators.required],
        feedByUrl: [{ value: '', disabled: this.disableAttachment }],
        avatar: [{ value: null, disabled: this.disableAttachment }, Validators.required],
        url: [{ value: null, disabled: true }]
      }),

      others: this.formBuilder.group({
        projectNumber: [null],
        managedBy: [this.projectDetail.follower ? this.projectDetail.follower.id : 0],
        start: [this.projectDetail.start ? new Date(this.projectDetail.startString) : new Date()],
        currency: [this.projectDetail.currency ? this.projectDetail.currency : null],
        businessUnit: [this.projectDetail.saleEntity ? this.projectDetail.saleEntity.id : 0],
        analyticAccountNumber: [this.projectDetail.analyticAccountNumber],
        language: [this.projectDetail.language],
        comment: [this.projectDetail.information ? this.projectDetail.information.comment : '']

      })


    });
    cb(fg);
  }

  /*-  To upload picture*/
  uploadPicture(showId: number) {
    if (this.budgetingForm.get('projectInfo').get('avatar').value) {
      let body = new FormData();
      body.append('discriminator', 'show');
      body.append('fileContent', this.budgetingForm.get('projectInfo').get('avatar').value);
      this.httpService.callApi("uploadPicture", { body: body, pathVariable: showId }).subscribe((respone) => {
        this.saveAttachment(showId, 0);
      }, (error) => {
        console.log('error ', error)
      });
    } else {
      this.saveAttachment(showId, 0);
    }
  }
  /*-  To create JSON for saving equipment.*/
  getJSONForSaveBudgeting(): any {
    let id = null;
    let version = null;
    if (this.projectDetail) {
      id = this.projectDetail.id;
      version = this.projectDetail.version;
    }
    let follower = this.dropdownData.followers ? this.dropdownData.followers.filter(el => el.id == this.budgetingForm.get('others').get('managedBy').value)[0] : null;

    let saleEntity = this.dropdownData.saleEntities ? this.dropdownData.saleEntities.filter(el => el.id == this.budgetingForm.get('others').get('businessUnit').value)[0] : null;
    let customer = this.dropdownData.clients.find(dt => dt.id == this.budgetingForm.get('projectInfo').get('customer').value);

    let budgetingData = {
      "id": id,
      "version": version,
      "title": this.budgetingForm.get('projectInfo').get('title').value,
      "status": this.budgetingForm.get('projectInfo').get('projectStatus').value,
      "company": customer ? { "id": customer.id } : null,
      "theme": this.selectedColor,
      "reference": this.budgetingForm.get('projectInfo').get('reference').value,
      "season": this.budgetingForm.get('projectInfo').get('season').value,
      "financialStatus": this.budgetingForm.get('projectInfo').get('financialStatus').value != 'null' ? this.budgetingForm.get('projectInfo').get('financialStatus').value : null,
      "information": {

        "comment": this.budgetingForm.get('others').get('comment').value,
      },
      "removeDocument":this.removeDocument,
      "analyticAccountNumber": this.budgetingForm.get('others').get('analyticAccountNumber').value,
      //"customer": this.budgetingForm.get('projectInfo').get('version').value,
      "channelFormat": this.channelFormat,
      "minuteDuration": this.budgetingForm.get('projectInfo').get('minuteDuration').value,
      "nbEpisodes": this.budgetingForm.get('projectInfo').get('nbEpisodes').value,
      "nbSessions": this.budgetingForm.get('projectInfo').get('nbSessions').value,
      "projectStatus": this.budgetingForm.get('projectInfo').get('projectStatus').value,
      "recordContacts": this.contacts,
      "localeLanguage": this.budgetingForm.get('others').get('language').value,
      "year": this.budgetingForm.get('projectInfo').get('year').value,
      "currency": this.budgetingForm.get('others').get('currency').value,
      "follower": follower ? { 'id': follower.id } : null,
      "saleEntity": saleEntity ? { "id": saleEntity.id } : null,
      "start": this.budgetingForm.get('others').get('start').value ? moment(this.budgetingForm.get('others').get('start').value).tz("Asia/Calcutta").format() : null,
      "startString": this.budgetingForm.get('others').get('start').value ? moment(this.budgetingForm.get('others').get('start').value).tz("Asia/Calcutta").format() : null,
    }
    return budgetingData;

  }

  /*-  To save show*/
  saveShow() {

    let body = this.getJSONForSaveBudgeting();
    if (body.financialStatus == 'Approved' && this.projectDetail && this.projectDetail.lines.length < 1) {
      this.toastr.warning("You cannot approve it because show does not have any booking line.", 'Show');
    } else {
      /**
       * validate title and company on show
       */
      let title = this.budgetingForm.get('projectInfo').get('title').value;
      let companyName = this.budgetingForm.get('others').get('businessUnit').value;
      if (title && title !== '') {
        if (companyName && companyName !== ''){
          this.httpService.callApi('saveShow', { body: body }).subscribe((response) => {
            // this.toastr.success("Successfully Saved", 'Show');
            let projectDetail = response;
            this.uploadPicture(projectDetail.id);
          }, error => {
            this.toastr.error(error.error.message, 'Show');
            console.log('Error getstatus => ', error)
          });
        } else {
          this.toastr.error("Please assign company","Show");
        }
      } else{   
        this.toastr.error("Please provide a valid show title","Show");
      }
    }
  }

  /*-  To handle event on FileChange for attachments*/
  onFileChange(event) {
    this.fileTarget = event.target || event.srcElement;
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
        this.invalidAttachmentFormatError = "Only jpg, jpeg, png or pdf  format allowed!!"
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
            "date": milestoneDate
          });
          this.dropdownData.milestones.splice(this.dropdownData.milestones.indexOf(milestoneType), 1);
          this.budgetingForm.get('milestones').get('milestoneType').reset();
          this.budgetingForm.get('milestones').get('milestoneDate').reset();

          break;
        }
      case 'Channel': {
        let channel = this.budgetingForm.get('milestones').get('selectedChannel').value;
        let format = this.budgetingForm.get('milestones').get('selectedChannelFormat').value;
        this.channelFormat.push({ "channel": channel, "format": format });
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
          this.fileTarget.value = "";
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
      case 'Channel': {
        this.channelFormat.splice(this.channelFormat.indexOf(obj), 1);
        this.dropdownData.channels.push(obj.channel);
        break;
      }
    }

  }
  clearSpace(form, fieldName) {
    if (form && fieldName) {
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
  saveAttachment(showId: number, index: number): string {

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
      body.append('discriminator', 'show');
      this.httpService.callApi("uploadAttachment", { body: body, pathVariable: showId }).subscribe((respone) => {

        this.saveAttachment(showId, ++index);
      }, (error) => {

        this.toastr.error(error.error.message, this.responseMessage);
        console.log('error ', error)
      });
    } else {
      this.saveAttachment(showId, ++index);
    }
  }
  deleteAttcahments() {
    let pathVariable: string = '/' + this.projectDetail.id + '/show';
    this.httpService.callApi("deleteAttachments", { pathVariable: pathVariable, body: this.removedAttachments }).subscribe((responce) => {
      this.toastr.success('Successfully Saved', this.responseMessage);
      //this.closeModalEvent.emit(false);
    }, (error) => {

    });
  }

  deleteShow($event) {
    if ($event) {
      this.httpService.callApi('deleteShow', { pathVariable: this.projectDetail.id }).subscribe((responce) => {
        this.toastr.success('Successfully Deleted', "Show");
        this.closeModalEvent.emit(false);
        this.router.navigate(['/teamium/show-list']);
      }, (error) => {
        this.toastr.error(error.error.message, this.responseMessage);
        console.log(error.error.message)
      });
    }
  }
  closeDeleteConfirmModal($event){
    this.showDeleteModal=$event;
  }
  preSession: number;

  calculateEpisode(session, episode) {
    if (session && episode && episode > 0) {
      if (session >= episode) {
        if (this.preSession != session) {
          this.preSession = episode;
          this.budgetingForm.get('projectInfo').get('nbSessions').setValue(episode);
        }
        return;
      }
      let nbS = session;
      while (nbS > 0) {
        if (episode % nbS == 0) {

          break;
        }
        nbS--;
      }
      if (this.preSession != nbS) {
        // this.preSession = nbS;
        this.budgetingForm.get('projectInfo').get('nbSessions').setValue(nbS);
      }
    }
  }

  // to remove show/program profile picture
  removePicture() {
    this.budgetingForm.get('projectInfo').get('avatar').setValue(null);
    this.pictureUrl = null;
    this.profilePictureName = 'No file chosen';
    this.addedPictureNameMessage = null;
    this.removeDocument=true;
  }

  validateYear(event) {
    var value = event.target.value;
    if (value) {
      this.budgetingForm.get("projectInfo").get("year").setValidators([Validators.maxLength(4),Validators.minLength(4)]);
      if (!(value.match("^[0-9]+$") && (value.length == 4))) {
        this.yearError = "Year should be of 4 digit.";
        if (!value.match("^[0-9]+$")) {
          this.budgetingForm.get("projectInfo").get("year").setValue("");
          this.yearError = undefined;
        }
        if (value.length > 4) {
          if (value.match("^[0-9]+$")) {
            this.budgetingForm.get("projectInfo").get("year").setValue(value.substr(0, value.length - 1));
            this.yearError = undefined;
          }
        }
      } else {
        this.yearError = undefined;
      }
    } else {
      this.yearError = undefined;
      this.budgetingForm.get("projectInfo").get("year").clearValidators();
    }
    this.budgetingForm.get("projectInfo").get("year").updateValueAndValidity();
  }

}
