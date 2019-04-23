import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSchedulerComponent } from './user-scheduler.component';

describe('UserSchedulerComponent', () => {
  let component: UserSchedulerComponent;
  let fixture: ComponentFixture<UserSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
