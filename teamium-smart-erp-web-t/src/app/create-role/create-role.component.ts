import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '../../../node_modules/@angular/forms';
import { HttpService } from '../core/services/http.service';
import { CommonUtilService } from '../core/services/common-util-service';
import { ToastrService } from '../../../node_modules/ngx-toastr';
import { Router } from '../../../node_modules/@angular/router';
import { forkJoin } from '../../../node_modules/rxjs';
@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})
export class CreateRoleComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @Input() projectDetail: any;
  @Input() selectedClient: any;
  constructor() { }

  ngOnInit() {
  }

  closeClientEditModal() {
    this.closeModalEvent.emit(false);
  }

}
