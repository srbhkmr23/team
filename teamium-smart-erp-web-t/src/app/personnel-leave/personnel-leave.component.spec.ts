import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelLeaveComponent } from './personnel-leave.component';

describe('PersonnelLeaveComponent', () => {
  let component: PersonnelLeaveComponent;
  let fixture: ComponentFixture<PersonnelLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonnelLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonnelLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
