import { Component, ViewChild, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Observable, AsyncSubject } from "rxjs";
import { DatePipe } from "@angular/common";
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-user-task',
  templateUrl: './user-task.component.html',
  styleUrls: ['./user-task.component.scss']
})
export class UserTaskComponent implements OnInit {

  form: FormGroup;
  dateFormat = "MM/dd/yyyy h:mm tt";
  isShow: boolean = false;
  subject: AsyncSubject<any>;
  errorStart = null;
  errorEnd = null;
  isEditable: boolean;
  eventId: number;
  isCreate: boolean;
  selectedColor: string = '#161514';
  projectList: any = [];
  functionList: any = [];

  constructor(private fb: FormBuilder, public datepipe: DatePipe) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ["", Validators.required],
      functionName: [""],
      start: [{ value: "" }, Validators.required],
      end: [{ value: "" }, Validators.required],
      project: [{ value: "" }],
      sick: false
    });

    this.form.get('project').valueChanges.subscribe((value) => {
      if (!value) {
        return;
      }
      if (value != "null") {
        if (!this.form.get('functionName').value) {
          this.form.get('functionName').setValue(this.functionList[0].id);
        }
      } else {
        this.form.get('project').setValue(null);
        this.form.get('functionName').setValue(null);
      }
    });

    this.form.get('start').valueChanges.subscribe((value) => {
      if (value) {
        let endValue = this.form.get('end').value;
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
    this.form.get('end').valueChanges.subscribe((value) => {
      if (value) {
        let startValue = this.form.get('start').value;
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

  show(ev: any, iscreate?: boolean): Observable<any> {
    console.log("Event ev=> ", ev)
    this.isCreate = false;
    this.eventId = null;
    this.isEditable = false;
    this.selectedColor = ev.data ? ev.data.theme || '#161514' : '#161514';
    if (iscreate) {
      this.form.reset();
      this.isCreate = true;
      this.projectList = ev.projectList;
      this.functionList = ev.functionList;
      this.form.setValue({
        name: null,
        functionName: null,
        start: new Date(ev.start),
        end: new Date(ev.end),
        project: null,
        sick: false
      });
    } else {
      let task = ev.data;
      this.eventId = ev.data.id;
      this.isEditable = ev.isEditable
      this.form.setValue({
        name: task.text,
        functionName: task.functionName ? task.functionName : null,
        start: task.userStartTime ? new Date(task.userStartTime) : null,
        end: task.userEndTime ? new Date(task.userEndTime) : null,
        project: null,
        sick: task.sick
      });
    }
    this.isShow = true;
    this.subject = new AsyncSubject();
    return this.subject.asObservable();
  }

  submit() {
    let data = this.form.getRawValue();
    console.log('b4 data => ', data)
    if (data.project) {
      data.sick = false;
    }
    console.log('a4 data => ', data)
    let params;
    if (this.isCreate && data.project) {
      params = {
        comment: data.name,
        start: moment(data.start).tz("Asia/Calcutta").format(),
        end: moment(data.end).tz("Asia/Calcutta").format(),
        resource: {
          id: sessionStorage.getItem('userId'),
        },
        projectId: data.project,
        function: {
          id: data.functionName
        },
        createProject: true,
        sick: data.sick
      };
    } else {
      params = {
        id: this.eventId,
        text: data.name,
        userStartTime: moment(data.start).tz("Asia/Calcutta").format(),
        userEndTime: moment(data.end).tz("Asia/Calcutta").format(),
        staffMemberId: sessionStorage.getItem('userId'),
        theme: this.selectedColor,
        projectId: data.project,
        functionId: data.functionName,
        createProject: false,
        sick: data.sick
      };
    }
    this.isShow = false;
    this.subject.next(params);
    this.subject.complete();
  }

  cancel() {
    this.isShow = false;
    this.subject.next(null);
    this.subject.complete();
  }

  delete() {
    let params = {
      id: this.eventId,
      delete: true
    }
    this.isShow = false;
    this.subject.next(params);
    this.subject.complete();
  }

}
