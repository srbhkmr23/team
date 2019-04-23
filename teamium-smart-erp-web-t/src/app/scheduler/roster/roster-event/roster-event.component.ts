import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from "@angular/forms";
import { Observable, AsyncSubject } from "rxjs";
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-roster-event',
  templateUrl: './roster-event.component.html',
  styleUrls: ['./roster-event.component.scss']
})
export class RosterEventComponent implements OnInit {
  subject: AsyncSubject<any>;
  isShow: boolean = false;
  eventInfo: FormGroup;
  functionList: any;
  resourceList: any;
  resources: any = [];
  intialResourceList: any = [];
  intialFunctionId;
  quantityError;
  errorStart;
  errorEnd;
  resourceError;
  modalHeading = "Add Event";

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.modalHeading = "Add Event";
    this.eventInfo = this.fb.group({
      id: null,
      functionId: [null, Validators.required],
      from: [],
      to: [],
      allDay: [false],
      quantity: [0],
      resourceId: [null, Validators.required]
    });

    this.eventInfo.get('quantity').valueChanges.subscribe(value => {
      if (value < this.resources.length) {
        this.quantityError = "Quantity can not be lesser than selected Resources.";
        this.resourceError = null;
      } else {
        this.quantityError = null;
        this.resourceError = null;
      }
    });

    this.eventInfo.get('functionId').valueChanges.subscribe(value => {
      if (value) {
        let functions = this.functionList.find(element => element.function.id == value);
        if (functions.defaultResource) {
          this.eventInfo.get('resourceId').setValue(functions.defaultResource.id);
        } else {
          this.eventInfo.get('resourceId').setValue(null);
        }
        this.resources = [];
        this.resourceList = JSON.parse(JSON.stringify(functions.resources));
        if (this.intialFunctionId && this.intialFunctionId == functions.function.id) {
          this.intialResourceList.forEach(element => {
            this.addResource(element.id);
          });
        }
      }
    });

    this.eventInfo.get('from').valueChanges.subscribe((value) => {
      if (value) {
        let endValue = this.eventInfo.get('to').value;
        if (endValue && value > endValue) {
          // console.log('error start')
          this.errorEnd = null;
          this.errorStart = 'Start date must be less than End date.'
        } else {
          this.errorStart = null;
          this.errorEnd = null;
        }
      }
    });
    this.eventInfo.get('to').valueChanges.subscribe((value) => {
      if (value) {
        let startValue = this.eventInfo.get('from').value;
        if (startValue && value < startValue) {
          // console.log('error end')
          this.errorStart = null;
          this.errorEnd = 'End date must be Greater than Start date.'
        } else {
          this.errorStart = null;
          this.errorEnd = null;
        }
      }
    });
  }

  show(ev: any): Observable<any> {
    this.resetData();
    this.functionList = ev.functionList;
    if (ev.id) {
      this.modalHeading = "Edit Event";
      this.intialResourceList = ev.resources;
      this.intialFunctionId = ev.functionId;
      this.eventInfo.setValue({
        id: ev.id,
        functionId: ev.functionId ? ev.functionId : null,
        resourceId: null,
        from: new Date(ev.from),
        to: new Date(ev.to),
        quantity: ev.quantity,
        allDay: true
      });
    } else {
      this.eventInfo.get('from').setValue(new Date(ev.from));
      this.eventInfo.get('to').setValue(new Date(ev.to));
    }
    this.isShow = true;
    this.subject = new AsyncSubject();
    return this.subject.asObservable();
  }

  submit() {
    this.isShow = false;
    let data = this.eventInfo.getRawValue();
    let rosterEvent = {
      id: data.id,
      quantity: data.quantity,
      startTime: moment(data.from).tz("Asia/Calcutta").format(),
      endTime: moment(data.to).tz("Asia/Calcutta").format(),
      functionId: data.functionId,
      resourcesDto: this.resources
    }
    this.subject.next(rosterEvent);
    this.subject.complete();
  }

  resetData() {
    this.eventInfo.reset();
    this.intialFunctionId = null;
    this.resources = [];
    this.quantityError = null;
    this.resourceError = null;
    this.errorStart = null;
    this.errorEnd = null;
    this.modalHeading = "Add Event";
  }

  cancel() {
    this.isShow = false;
    this.subject.next(null);
    this.subject.complete();
    this.modalHeading = "Add Event";
  }

  addResource(id?) {
    let resourceId;
    if (id) {
      resourceId = id;
    } else {
      resourceId = this.eventInfo.get('resourceId').value;
    }
    this.eventInfo.get('resourceId').setValue(null);
    let resource = this.resourceList.find(el => el.id == resourceId);
    this.resourceList.splice(this.resourceList.indexOf(resource), 1);
    this.resources.push({
      id: resource.id,
      name: resource.name
    });
    this.checkResourceError();
  }

  removeResource(resource) {
    this.resources.splice(this.resources.indexOf(resource), 1);
    this.resourceList.push(resource);
  }

  checkResourceError() {
    let quantity = this.eventInfo.get('quantity').value;

    if (quantity < this.resources.length) {
      this.resourceError = "Selected Resources can not be greater than Quantity.";
      this.quantityError = null;
    } else {
      this.resourceError = null;
      this.quantityError = null;
    }
  }
}
