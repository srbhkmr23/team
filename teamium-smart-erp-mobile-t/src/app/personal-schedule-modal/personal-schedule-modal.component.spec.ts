import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalScheduleModalComponent } from './personal-schedule-modal.component';

describe('PersonalScheduleModalComponent', () => {
  let component: PersonalScheduleModalComponent;
  let fixture: ComponentFixture<PersonalScheduleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalScheduleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalScheduleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
