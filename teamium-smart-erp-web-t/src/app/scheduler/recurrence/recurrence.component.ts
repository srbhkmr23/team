import { Component, ViewChild, OnInit } from "@angular/core";
import { DayPilot, DayPilotModalComponent } from "daypilot-pro-angular";
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from "@angular/forms";
import { Observable, AsyncSubject } from "rxjs";
import { DatePipe } from "@angular/common";
import * as moment from 'moment-timezone';
import { fail } from "assert";

@Component({
  selector: 'app-recurrence',
  templateUrl: './recurrence.component.html',
  styleUrls: ['./recurrence.component.scss']
})
export class RecurrenceComponent implements OnInit {
  isShow: boolean = false;
  subject: AsyncSubject<any>;
  form: FormGroup;
  cloneEventId: number;
  errorStart = null;
  errorEnd = null;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    console.log("RecurrenceComponent")
    this.form = this.fb.group({
      start: [{ value: "" }, Validators.required],
      end: [{ value: "" }, Validators.required],
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
      week:  [{ value: 1 }, Validators.required],
    });
    this.form.get('week').valueChanges.subscribe((value) => {
      if (value == 0) {
        this.form.get('week').setValue(1);
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

  show(eventId): Observable<any> {
    console.log(" show RecurrenceComponent => ", eventId);
    this.errorStart = null;
    this.errorEnd = null;
    this.cloneEventId = eventId;
    this.form.setValue({
      start: null,
      end: null,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
      week: 1
    });
    this.isShow = true;
    this.subject = new AsyncSubject();
    return this.subject.asObservable();
  }

  submit() {
    let data = this.form.getRawValue();
    console.log('b4 data => ', data);
    let days = this.getDays(data);

    let params = {
      startDate: moment(data.start).tz("Asia/Calcutta").format(),
      endDate: moment(data.end).tz("Asia/Calcutta").format(),
      days: days,
      plusWeeks: data.week,
      cloneEventId: this.cloneEventId
    };
    console.log("params => ", params)
    this.isShow = false;
    this.subject.next(params);
    this.subject.complete();
  }

  getDays(data) {
    let days = [];
    if (data.mon) {
      days.push("MONDAY")
    }
    if (data.tue) {
      days.push("TUESDAY")
    }
    if (data.wed) {
      days.push("WEDNESDAY")
    }
    if (data.thu) {
      days.push("THURSDAY")
    }
    if (data.fri) {
      days.push("FRIDAY")
    }
    if (data.sat) {
      days.push("SATURDAY")
    }
    if (data.sun) {
      days.push("SUNDAY")
    }
    return days;
  }

  cancel() {
    this.isShow = false;
    this.subject.next(null);
    this.subject.complete();
  }
}
