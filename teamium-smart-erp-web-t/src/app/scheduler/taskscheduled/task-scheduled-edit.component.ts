import { Component, ViewChild, OnInit } from "@angular/core";
import { DayPilot, DayPilotModalComponent } from "daypilot-pro-angular";
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from "@angular/forms";
import { Observable, AsyncSubject } from "rxjs";
import { DatePipe } from "@angular/common";
import * as moment from 'moment-timezone';
import { RecurrenceComponent } from "../recurrence/recurrence.component";

@Component({
  selector: 'task-scheduled-edit-dialog',
  templateUrl: './task-scheduled-edit.component.html',
  styleUrls: ['./task-scheduled-edit.component.scss']
})
export class TaskScheduledEditComponent implements OnInit {
  form: FormGroup;
  dateFormat = "MM/dd/yyyy h:mm tt";
  resources: any[];
  task: any;
  isShow: boolean = false;
  selectedColor: string = '#161514';
  subject: AsyncSubject<any>;
  status: any;
  functionDropdown: any;
  mainResources: any[];
  projectList: any;
  freeze: any;
  malnualUpdate: any;
  errorStart = null;
  errorEnd = null;
  showMaintenance: boolean = false;

  @ViewChild("recurrenceSchedule") recurrenceSchedule: RecurrenceComponent;

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
        start: [{ value: "" }],
        end: [{ value: "" }],
        functionId: { value: "", disabled: true },
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

    this.form.get('functionInfo').get('functionValue').valueChanges.subscribe(value => {
      if (value) {
        let functions = this.functionDropdown.find(element => element.function.id == value.id);
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
    });
  }
  createLine(functionValue, resourceValue): FormGroup {
    return this.fb.group({
      functionId: [functionValue],
      resource: [resourceValue],
    });
  }
  show(ev: any): Observable<any> {

    this.freeze = ev.data.projectStatus == "Done"
    this.malnualUpdate = ev.data.manualUpdate;
    this.mainResources = ev.resources;
    this.functionDropdown = ev.functionDropdown;
    this.task = ev.data;
    this.showMaintenance = false;
    if (ev.functionName && ev.functionName.type == 'equipment') {
      this.showMaintenance = true;
    }
    if (this.freeze) {
      this.projectList = ev.projectList;
    } else {
      this.projectList = ev.projectList.filter(el => el.status != 'Done');
    }

    let items = this.form.get('lines') as FormArray;
    this.clearFormArray(items);

    this.selectedColor = ev.data.theme || '#161514';
    this.form.setValue({
      eventInfo: {
        project: ev.projectName,
        start: new Date(this.task.start),
        end: new Date(this.task.end),
        text: this.task.text,
        resource: this.task.resourceId,
        functionId: ev.functionName.id,
        statusKey: this.task.status ? this.task.status : null,
        completion: this.task.completion ? this.task.completion : 0,
        comment: this.task.comment ? this.task.comment : ''
      },
      functionInfo: {
        functionValue: null,
        resourceValue: null
      },
      lines: []
    });
    this.isShow = true;
    this.subject = new AsyncSubject();
    return this.subject.asObservable();
  }

  submit() {
    let data = this.form.getRawValue();
    // console.log('data => ',data)
    let params = {
      id: this.task.id,
      projectId: data.eventInfo.project,
      start: data.eventInfo.start,
      end: data.eventInfo.end,
      startTime: moment(data.eventInfo.start).tz("Asia/Calcutta").format(),
      endTime: moment(data.eventInfo.end).tz("Asia/Calcutta").format(),
      functionId: data.eventInfo.functionId,
      resource: data.eventInfo.resource,
      text: data.eventInfo.text,
      theme: this.selectedColor,
      changeable: true,
      status: data.eventInfo.statusKey,
      linkedEvents: data.lines,
      moveLinkedEvent: true,
      completion: data.eventInfo.completion,
      comment: data.eventInfo.comment
    };

    // console.log('this.params ', params)
    this.isShow = false;
    this.subject.next(params);
    this.subject.complete();

  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
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

  showRecurrence() {
    console.log("showRecurrence")
    this.recurrenceSchedule.show(this.task.id).subscribe(result => {
      if (!result) {
        return;
      }
      result.recurrence = true;
      this.isShow = false;
      this.subject.next(result);
      this.subject.complete();
    });
  }
}

