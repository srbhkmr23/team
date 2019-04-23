import { Component, OnInit, HostListener, Sanitizer, ViewChild } from '@angular/core';
import { DataService } from '../core/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../core/services/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment-timezone';
import { DayPilot } from 'daypilot-pro-angular';
import { forkJoin } from 'rxjs';
import { LeaveRequestComponent } from '../leave-request/leave-request.component';

@Component({
  selector: 'app-personnel-leave',
  templateUrl: './personnel-leave.component.html',
  styleUrls: ['./personnel-leave.component.scss']
})
export class PersonnelLeaveComponent implements OnInit {
  public showOrderEditModal: boolean = false;
  personalId: number;
  userLeaveRecordDTO: any;
  show: number;
  personnelDetail: any;
  blockedPanel: boolean;
  isShow: boolean = false;
  @ViewChild("leaveRequest") leaveRequest: LeaveRequestComponent;

  constructor(private router: Router, private httpService: HttpService, private toastr: ToastrService, private dataService: DataService, private route: ActivatedRoute, ) {

  }
  ngOnInit() {
    this.dataService.checkSubmenu(this.router);
    this.route.params.subscribe(params => this.personalId = params.id);
    let pathVariable: any = new Array();
    pathVariable.push({ "staffId": this.personalId });
    this.dataService.addPathvariables(pathVariable);
    let personalDetailsAPI = this.httpService.callApi('getPersonnelById', { pathVariable: this.personalId });
    let userLeaveDetailsAPI = this.httpService.callApi('findUserLeaveRecordByStaffId', { pathVariable: "/" + this.personalId });
    this.blockedPanel = true;
    forkJoin([userLeaveDetailsAPI, personalDetailsAPI]).subscribe((responseList) => {
      this.setUserLeaveRecord(responseList[0]);
      this.personnelDetail = responseList[1];
      this.blockedPanel = false;
    }, (errorList) => {
      console.log("errorList => ", errorList)
      this.blockedPanel = false;
    });
  }

  saveLeaveRecord(leaveRecord) {
    if (leaveRecord) {
      this.blockedPanel = true;
      let data = {
        staffMemberId: this.personalId,
        userLeaveRecordId: this.userLeaveRecordDTO.userLeaveRecordId,
        changeLeaveRecordDTO: leaveRecord
      }
      this.httpService.callApi('saveOrUpdateUserLeaveRecord', { body: data }).subscribe((response) => {
        this.setUserLeaveRecord(response);
        this.toastr.success('Successfully Saved', 'Days Off');
        this.blockedPanel = false;
      }, (error) => {
        console.log('Error => ', error)
        this.toastr.error(error.error.message, 'Days Off');
        this.blockedPanel = false;
      });
    }
  }

  showModal() {
    this.leaveRequest.show(this.userLeaveRecordDTO).subscribe(result => {
      // console.log(' resultUpdate ', result)
      if (!result) {
        return; // cancelled
      }
      this.saveRequest(result);
    });
  }

  showAttachmentModal(leaveRequest) {
    this.leaveRequest.showLeaveRequest().subscribe(result => {
      // console.log(' resultUpdate ', result)
      if (!result) {
        return; // cancelled
      }
      this.blockedPanel = true;
      this.loadAttachment(result, leaveRequest.leaveRequestId, (response) => {
        let index = this.userLeaveRecordDTO.leaveRequestDTOs.findIndex(el => el.leaveRequestId == response.leaveRequestId);
        if (index > -1) {
          // this.userLeaveRecordDTO.leaveRequestDTOs.splice(index, 1, respone);
          this.userLeaveRecordDTO.leaveRequestDTOs[index] = response;
        }
        this.toastr.success('Successfully Applied Attachment', 'Personnel Leave');
      });
    });
  }

  saveRequest(data) {
    this.blockedPanel = true;
    let param = {
      staffMemberId: this.personalId,
      userLeaveRecordId: this.userLeaveRecordDTO.userLeaveRecordId,
      changeLeaveRequestDTO: {
        leaveRecordDTO: this.userLeaveRecordDTO.availableLeaveRecordDTOs.find(i => i.leaveRecordId == data.leaveRecordDTO),
        startTime: moment(data.startTime).tz("Asia/Calcutta").format(),
        endTime: moment(data.endTime).tz("Asia/Calcutta").format(),
        numberOfDay: data.numberOfDay,
        leaveStatus: this.userLeaveRecordDTO.leaveStatus[0],
        comment: data.comment
      }
    }
    this.httpService.callApi('saveOrUpdateUserLeaveRequest', { body: param }).subscribe((response) => {
      if (data.avatar) {
        this.loadAttachment(data, response.leaveRequestDTOs[response.leaveRequestDTOs.length - 1].leaveRequestId, (respone) => {
          this.userLeaveRecordDTO.leaveRequestDTOs.push(respone);
          this.toastr.success('Successfully Applied', 'Personnel Leave');
        });
      } else {
        this.blockedPanel = false;
        let newLeaveRequest = response.leaveRequestDTOs[response.leaveRequestDTOs.length - 1];
        newLeaveRequest.startTime = new DayPilot.Date(moment(newLeaveRequest.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss")).toString("dd/MM/yy");
        newLeaveRequest.endTime = new DayPilot.Date(moment(newLeaveRequest.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss")).toString("dd/MM/yy");
        this.userLeaveRecordDTO.leaveRequestDTOs.push(newLeaveRequest);
        this.showOrderEditModal = false;
        this.setUserLeaveRecord(response);
        this.toastr.success('Successfully Applied', 'Personnel Leave');
      }
    }, (error) => {
      console.log('Error => ', error)
      this.toastr.error(error.error.message, 'Personnel Leave');
      this.blockedPanel = false;
    })
  }

  changeStatusForLeaveRequest(leave, status) {
    leave.leaveStatus = status;
    this.blockedPanel = true;
    this.httpService.callApi('changeStatusOfLeaveRequest', { body: leave }).subscribe((response) => {
      this.httpService.callApi('findUserLeaveRecordByStaffId', { pathVariable: "/" + this.personalId }).subscribe((response) => {
        this.setUserLeaveRecord(response);
        this.blockedPanel = false;
        this.toastr.success("Successfully Updated", "Personnel Leave")
      }, (error) => {
        console.log('error => ', error);
        this.blockedPanel = false;
      });
    }, (error) => {
      console.log('error => ', error);
      this.blockedPanel = false;
      this.toastr.error(error.error.message, "Personnel Leave")
    });
  }

  setUserLeaveRecord(response) {
    this.userLeaveRecordDTO = response;
    if (this.userLeaveRecordDTO.leaveRequestDTOs) {
      this.userLeaveRecordDTO.leaveRequestDTOs.forEach(element => {
        element.startTime = new DayPilot.Date(moment(element.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss")).toString("dd/MM/yy");
        element.endTime = new DayPilot.Date(moment(element.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss")).toString("dd/MM/yy");
      });
    }
  }

  showStatusModal(i) {
    if (this.show == i && this.show > -1) {
      this.show = -1;
      return;
    }
    this.show = i;
  }

  @HostListener('document:click', ['$event.target'])
  onClickedOutside(targetElement) {
    if (!targetElement.closest('#status-id') && this.show) {
      this.show = -1;
    }
  }

  loadAttachment(data, leaveId, cb) {
    let body = new FormData();
    body.append('fileContent', data.avatar);
    body.append('attachmentType', data.attachmentType);
    body.append('discriminator', 'leave');
    this.httpService.callApi("uploadAttachment", { body: body, pathVariable: leaveId }).subscribe((respone) => {
      this.blockedPanel = false;
      this.showOrderEditModal = false;
      respone.startTime = new DayPilot.Date(moment(respone.startTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss")).toString("dd/MM/yy");
      respone.endTime = new DayPilot.Date(moment(respone.endTime).tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss")).toString("dd/MM/yy");
      cb(respone);
    }, (error) => {
      console.log('error ', error)
      this.toastr.success(error.error.message, 'Personnel Leave');
      this.blockedPanel = false;
    });
  }

  removeAttachment(leaveRequest) {
    console.log("leaveRequest => ",leaveRequest)
    this.blockedPanel = true;
    this.httpService.callApi('deleteAttachments', { pathVariable: "" + leaveRequest.leaveRequestId + "/" + 'leave' }).subscribe((response) => {
      // let leave = this.userLeaveRecordDTO.leaveRequestDTOs.find(el => el.leaveRequestId == leaveRequest.leaveRequestId);
      // if (leave) {
        leaveRequest.fileUploadDTO=null;
      // }
      this.toastr.success('Successfully Deleted Attachment', 'Personnel Leave');
      this.blockedPanel = false;
    }, (error) => {
      this.blockedPanel = false;
      this.toastr.error(error.error.message, 'Personnel Leave');
    });
  }

}
