import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSequentialBookingComponent } from './dashboard-sequential-booking.component';

describe('DashboardSequentialBookingComponent', () => {
  let component: DashboardSequentialBookingComponent;
  let fixture: ComponentFixture<DashboardSequentialBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSequentialBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSequentialBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
