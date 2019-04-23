import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSchedulerComponent } from './group-scheduler.component';

describe('GroupSchedulerComponent', () => {
  let component: GroupSchedulerComponent;
  let fixture: ComponentFixture<GroupSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
