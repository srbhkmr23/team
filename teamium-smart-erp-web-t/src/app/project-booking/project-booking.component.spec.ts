import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBookingComponent } from './project-booking.component';

describe('ProjectBookingComponent', () => {
  let component: ProjectBookingComponent;
  let fixture: ComponentFixture<ProjectBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
