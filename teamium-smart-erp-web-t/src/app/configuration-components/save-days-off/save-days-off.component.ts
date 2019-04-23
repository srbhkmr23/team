import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-save-days-off',
  templateUrl: './save-days-off.component.html',
  styleUrls: ['./save-days-off.component.scss']
})
export class SaveDaysOFF implements OnInit {
  @Input() componentName='Days Off';
  @Input() selectedDaysOff: any;
  @Output() closeModalEvent = new EventEmitter<boolean>();
  leaveTypeForm: FormGroup;
  blockedPanel: boolean = false;
  showError: boolean = false;
  modalText: string = '';

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.modalText = "Create Day Off";
    if (this.selectedDaysOff.leaveTypeId) {
      this.modalText = "Edit Day Off";
      this.leaveTypeForm = this.formBuilder.group({
        leaveTypeId: this.selectedDaysOff.leaveTypeId,
        type: [this.selectedDaysOff.type, Validators.required]
      });
    } else {
      this.leaveTypeForm = this.formBuilder.group({
        type: [null, Validators.required]
      });
    }
    this.leaveTypeForm.get('type').valueChanges.subscribe((value) => {
      if (value) {
        this.showError = false;
      } else {
        this.showError = true;
      }
    });
  }

  saveOrUpdateLeaveType() {
    this.blockedPanel = true;
    let data = this.leaveTypeForm.getRawValue();
    this.httpService.callApi('saveOrUpdateLeaveType', { body: data }).subscribe((response) => {
      this.blockedPanel = false;
      this.toastr.success("Successfully Saved", "Day Off");
      this.hideDaysOffModal();
    }, (error) => {
      this.toastr.error(error.error.message, "Day Off");
      this.blockedPanel = false;
    });
  }

  inActivateLeaveType() {
    this.blockedPanel = true;
    let data = this.leaveTypeForm.getRawValue();
    this.httpService.callApi('inActivateLeaveType', { pathVariable: "/" + data.leaveTypeId }).subscribe((response) => {
      this.blockedPanel = false;
      this.toastr.success("Successfully Deleted", "Day Off");
      this.hideDaysOffModal();
    }, (error) => {
      this.toastr.error(error.error.message, "Day Off");
      this.blockedPanel = false;
    });
  }

  hideDaysOffModal() {
    this.closeModalEvent.emit(false);
  }
}
