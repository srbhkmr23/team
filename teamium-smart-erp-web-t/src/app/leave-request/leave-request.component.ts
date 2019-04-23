import { Component, OnInit } from '@angular/core';
import { AsyncSubject, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DayPilot } from 'daypilot-pro-angular';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss']
})
export class LeaveRequestComponent implements OnInit {

  isShow: boolean = false;
  isLeave: boolean = false;
  subject: AsyncSubject<any>;
  errorStart = null;
  errorEnd = null;
  dayDiff: number = 0;
  numOfDaysError = null;
  leaveForm: FormGroup;
  remainBalance: number = 0;
  allowedExtensionsForAttachment = ['jpg', 'jpeg', 'png', 'pdf'];
  invalidPhotoFormatError: string = null;
  invalidAttachmentFormatError: string = null;
  addedAttachmentFileName: string;
  userLeaveRecordDTO: any;
  attachments = [];
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.leaveForm = this.fb.group({
      leaveRecordDTO: ["", Validators.required],
      startTime: [{ value: null }, Validators.required],
      endTime: [{ value: null }, Validators.required],
      numberOfDay: [1],
      avatar: [null],
      attachmentType: [null],
      comment: [null]
    });

    this.leaveForm.get('numberOfDay').valueChanges.subscribe((value) => {
      this.numOfDaysError = false;
      if (!value || this.dayDiff < value || value == 0) {
        this.numOfDaysError = true;
      }
    });

    this.leaveForm.get('leaveRecordDTO').valueChanges.subscribe((value) => {
      if (this.leaveForm) {
        return;
      }
      this.remainBalance = 0
      let leaveRecord = this.userLeaveRecordDTO.leaveRecordDTOs.find(el => el.leaveRecordId == value);
      if (leaveRecord) {
        this.remainBalance = leaveRecord.remainBalance;
      }
    });

    this.leaveForm.get('startTime').valueChanges.subscribe((value) => {
      if (this.leaveForm) {
        return;
      }
      if (value) {
        let endValue = this.leaveForm.get('endTime').value;
        let numOfDaysValue = this.leaveForm.get('numberOfDay').value;
        this.dayDiff = 0;
        this.numOfDaysError = false;
        if (endValue && value > endValue) {
          this.errorEnd = null;
          this.errorStart = 'Start date must be less than End date.'
        } else {
          this.errorStart = null;
          this.errorEnd = null;
          if (endValue) {
            this.dayDiff = new DayPilot.Duration(new DayPilot.Date(value), new DayPilot.Date(endValue)).days() + 1;
          }
        }
        if (!numOfDaysValue || this.dayDiff < numOfDaysValue || numOfDaysValue == 0) {
          this.numOfDaysError = true;
        }
      }
    });
    this.leaveForm.get('endTime').valueChanges.subscribe((value) => {
      if (this.leaveForm) {
        return;
      }
      if (value) {
        let startValue = this.leaveForm.get('startTime').value;
        this.dayDiff = 0;
        let numOfDaysValue = this.leaveForm.get('numberOfDay').value;
        this.numOfDaysError = false;
        if (startValue && value < startValue) {
          this.errorStart = null;
          this.errorEnd = 'End date must be Greater than Start date.'
        } else {
          this.errorStart = null;
          this.errorEnd = null;
          if (startValue) {
            this.dayDiff = new DayPilot.Duration(new DayPilot.Date(startValue), new DayPilot.Date(value)).days() + 1;
          }
        }
        if (!numOfDaysValue || this.dayDiff < numOfDaysValue || numOfDaysValue == 0) {
          this.numOfDaysError = true;
        }
      }
    });
  }

  show(userLeaveRecordDTO): Observable<any> {
    this.isLeave = false;
    this.userLeaveRecordDTO = userLeaveRecordDTO;
    this.errorStart = null;
    this.errorEnd = null;
    this.invalidAttachmentFormatError = null;
    this.addedAttachmentFileName = null;
    this.attachments = [];
    this.leaveForm.setValue({
      leaveRecordDTO: null,
      startTime: null,
      endTime: null,
      numberOfDay: 1,
      avatar: null,
      comment: null,
      attachmentType: null,
    });
    this.isShow = true;
    this.subject = new AsyncSubject();
    return this.subject.asObservable();
  }

  showLeaveRequest(): Observable<any> {
    this.isLeave = true;
    this.invalidAttachmentFormatError = null;
    this.addedAttachmentFileName = null;
    this.attachments = [];
    this.leaveForm.setValue({
      leaveRecordDTO: null,
      startTime: null,
      endTime: null,
      numberOfDay: 1,
      avatar: null,
      comment: null,
      attachmentType: null,
    });
    this.isShow = true;
    this.subject = new AsyncSubject();
    return this.subject.asObservable();
  }

  submitLeaveRequest() {
    this.isShow = false;
    // console.log('Params ', params)
    if (this.attachments[0]) {
      this.leaveForm.get('avatar').setValue(this.attachments[0].avatar);
      this.leaveForm.get('attachmentType').setValue(this.attachments[0].type);
    }
    this.subject.next(this.leaveForm.getRawValue());
    this.subject.complete();
  }

  submit() {
    this.isShow = false;
    // console.log('Params ', params)
    if (this.attachments[0]) {
      this.leaveForm.get('avatar').setValue(this.attachments[0].avatar);
      this.leaveForm.get('attachmentType').setValue(this.attachments[0].type);
    }
    this.subject.next(this.leaveForm.getRawValue());
    this.subject.complete();
  }

  cancel() {
    this.isShow = false;
    this.subject.next(null);
    this.subject.complete();
  }

  /*-  To handle event on FileChange for attachments*/
  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let fileExtension = file.name.split('.').pop().toLowerCase();
      if (this.isInArray(this.allowedExtensionsForAttachment, fileExtension) && file.size < 2097152) {
        this.invalidAttachmentFormatError = null;
        this.leaveForm.get('avatar').setValue(file);
        this.addedAttachmentFileName = "Successfully added File:" + file.name;
      } else if (file.size > 2097152) {
        this.addedAttachmentFileName = null;
        this.leaveForm.get('avatar').setValue(null);
        this.invalidAttachmentFormatError = "File size should not be greater than 2MB."
      }
      else {
        this.addedAttachmentFileName = null;
        this.leaveForm.get('avatar').setValue(null);
        this.invalidAttachmentFormatError = "Only jepg, jpg, png or pdf format allowed!!"
      }
    }
  }

  /*- checks if word exists in array -*/
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  addAttachment() {
    let fileExtention = this.leaveForm.get('avatar').value.name.split('.').pop().toLowerCase();
    this.attachments.push({ 'type': this.leaveForm.get('attachmentType').value, 'extension': fileExtention, 'avatar': this.leaveForm.get('avatar').value });
    this.clearAttachmentValue();
  }

  clearAttachment() {
    this.attachments = [];
    this.clearAttachmentValue();
  }

  clearAttachmentValue() {
    this.leaveForm.get('avatar').setValue(null);
    this.leaveForm.get('attachmentType').setValue(null);
    this.invalidAttachmentFormatError = null;
    this.addedAttachmentFileName = null;
  }

  getAttachmentImage(extension) {
    if (extension == 'pdf') {
      return '../../assets/img/pdf_logo.jpg';
    }
    return '../../assets/img/image_icon.png';
  }

}
