import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from "@angular/forms";
import { Observable, AsyncSubject } from "rxjs";
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-create-project-event',
  templateUrl: './create-project-event.component.html',
  styleUrls: ['./create-project-event.component.scss']
})
export class CreateProjectEventComponent implements OnInit {
  subject: AsyncSubject<any>;
  isShow: boolean = false;
  budgetInfo: FormGroup;
  categories: any = [];
  selectedColor: string = '#161514';
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.budgetInfo = this.fb.group({
      title: [null, Validators.required],
      category: [],
      from: []
    });
  }

  show(ev: any): Observable<any> {
    console.log('Event => ', ev)
    this.budgetInfo.reset();
    this.selectedColor = '#161514';
    this.categories = ev.categories;
    this.budgetInfo.get('from').setValue(new Date(ev.from.value));
    this.isShow = true;
    this.subject = new AsyncSubject();
    return this.subject.asObservable();
  }

  submit() {
    const data = this.budgetInfo.getRawValue();
    data.recordDate = moment(data.from).tz("Asia/Calcutta").format();
    data.status = 'To Do';
    data.theme= this.selectedColor
    this.isShow = false;
    this.subject.next(data);
    this.subject.complete();
  }

  cancel() {
    this.isShow = false;
    this.subject.next(null);
    this.subject.complete();
  }

}
