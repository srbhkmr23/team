import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterEventComponent } from './roster-event.component';

describe('RosterEventComponent', () => {
  let component: RosterEventComponent;
  let fixture: ComponentFixture<RosterEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosterEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
