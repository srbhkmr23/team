import { Component, ViewChild, OnInit } from "@angular/core";
import { DayPilot, DayPilotModalComponent } from "daypilot-pro-angular";
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from "@angular/forms";
import { Observable, AsyncSubject } from "rxjs";
import { DatePipe } from "@angular/common";
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-createevent',
  templateUrl: './createevent.component.html',
  styleUrls: ['./createevent.component.scss']
})
export class CreateeventComponent implements OnInit {

  form: FormGroup;
  dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
  resources: any[];
  mainResources: any[];
  task: any;
  isShow: boolean = false;
  selectedColor: string = '#161514';
  subject: AsyncSubject<any>;
  functionDropdown: any;
  status: any;
  projectList: any;

  errorStart = null;
  errorEnd = null;

  constructor(private fb: FormBuilder, public datepipe: DatePipe) {

  }

  ngOnInit() {
    this.status = [
      {
        "statusKey": "Requested",
        "statusValue": "green"
      },
      {
        "statusKey": "Confirmed",
        "statusValue": "white"
      },
      {
        "statusKey": "Awaiting Confirmation",
        "statusValue": "orange"
      },
      {
        "statusKey": "On Hold",
        "statusValue": "red"
      },
      {
        "statusKey": "Penciled",
        "statusValue": "grey"
      }
    ]
    this.form = this.fb.group({
      eventInfo: this.fb.group({
        project: ["", Validators.required],
        text: ["", Validators.required],
        start: [],
        end: [],
        functionId: ["", Validators.required],
        resource: ["", Validators.required],
        statusKey: [null],
        comment: [null],
        completion: [0]
      }),

      functionInfo: this.fb.group({
        functionValue: [null, Validators.required],
        resourceValue: [null, Validators.required],
      }),
      lines: this.fb.array([])

    });

    this.form.get('eventInfo').get('functionId').valueChanges.subscribe(value => {
      if (value) {
        let functions = this.functionDropdown.find(element => element.function.id == value);
        if (functions.defaultResource) {
          this.form.get('eventInfo').get('resource').setValue(functions.defaultResource.id);
        } else {
          this.form.get('eventInfo').get('resource').setValue(null);
        }
        this.mainResources = functions.resources;
      }
    });

    this.form.get('functionInfo').get('functionValue').valueChanges.subscribe(value => {
      if (value) {
        let functions = this.functionDropdown.find(element => element.function.id == value.id);
        // console.log('functions => ', functions)
        if (functions.defaultResource) {
          this.form.get('functionInfo').get('resourceValue').setValue(functions.defaultResource.id);
        } else {
          this.form.get('functionInfo').get('resourceValue').setValue(null);
        }
        this.resources = functions.resources;
      }
    });

    this.form.get('eventInfo').get('start').valueChanges.subscribe((value) => {
      console.log('start  value ', value)
      if (value) {
        let endValue = this.form.get('eventInfo').get('end').value;
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
    this.form.get('eventInfo').get('end').valueChanges.subscribe((value) => {
      console.log('end  value ', value)
      if (value) {
        let startValue = this.form.get('eventInfo').get('start').value;
        if (startValue && value < startValue) {
          // console.log('error end')
          this.errorStart = null;
          this.errorEnd = 'End date must be Greater than Start date.'
        } else {
          this.errorStart = null;
          this.errorEnd = null;
        }
      }
    })
    // this.form.valueChanges.subscribe(console.log);
  }

  createLine(functionValue, resourceValue): FormGroup {
    return this.fb.group({
      functionId: [functionValue],
      resource: [resourceValue],
    });
  }

  show(ev: any): Observable<any> {
    console.log("ev => ",ev)
    this.form.reset();
    this.form.get('functionInfo').reset();
    let items = this.form.get('lines') as FormArray;
    this.clearFormArray(items);
    this.projectList = ev.projectList.filter(el => el.status != 'Done');
    this.functionDropdown = ev.functionDropdown;
    this.form.get('eventInfo').get('start').setValue(new Date(ev.data.start.value));
    this.form.get('eventInfo').get('end').setValue(new Date(ev.data.end.value));
    this.form.get('eventInfo').get('functionId').setValue(ev.functionId);
    this.form.get('eventInfo').get('resource').setValue(ev.resource),
      this.isShow = true;
    this.subject = new AsyncSubject();
    return this.subject.asObservable();
  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  submit() {
    let data = this.form.getRawValue();
    let params = {
      projectId: data.eventInfo.project,
      start: moment(data.eventInfo.start).tz("UTC").format(),
      end: moment(data.eventInfo.end).tz("UTC").format(),
      startTime: moment(data.eventInfo.start).tz("Asia/Calcutta").format(),
      endTime: moment(data.eventInfo.end).tz("Asia/Calcutta").format(),
      resource: data.eventInfo.resource,
      text: data.eventInfo.text,
      theme: this.selectedColor,
      changeable: true,
      status: data.eventInfo.statusKey,
      functionId: data.eventInfo.functionId,
      linkedEvents: data.lines,
      completion: data.eventInfo.completion,
      comment: data.eventInfo.comment
    };

    this.isShow = false;
    // console.log('Params ', params)
    this.subject.next(params);
    this.subject.complete();
  }

  cancel() {
    this.isShow = false;
    this.subject.next(null);
    this.subject.complete();
  }

  dateTimeValidator(format: string) {
    return function (c: FormControl) {
      let valid = !!DayPilot.Date.parse(c.value, format);
      return valid ? null : { badDateTimeFormat: true };
    };
  }
  addFunction() {
    let functionInfo = this.form.get('functionInfo');
    let items = this.form.get('lines') as FormArray;
    items.push(this.createLine(functionInfo.get('functionValue').value.id, functionInfo.get('resourceValue').value));
    functionInfo.reset();
  }
  deleteLine(index) {
    let items = this.form.get('lines') as FormArray;
    items.removeAt(index)
  }
  getResources(index) {
    let items = this.form.get('lines') as FormArray;
    let functions = this.functionDropdown.find(element => element.function.id == items.value[index].functionId);
    return functions.resources;
  }
}
