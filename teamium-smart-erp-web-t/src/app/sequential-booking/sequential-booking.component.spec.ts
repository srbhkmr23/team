import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SequentialBookingComponent } from './sequential-booking.component';

describe('SequentialBookingComponent', () => {
  let component: SequentialBookingComponent;
  let fixture: ComponentFixture<SequentialBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequentialBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequentialBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
