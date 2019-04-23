import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingconflictModalComponent } from './bookingconflict-modal.component';

describe('BookingconflictModalComponent', () => {
  let component: BookingconflictModalComponent;
  let fixture: ComponentFixture<BookingconflictModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingconflictModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingconflictModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
