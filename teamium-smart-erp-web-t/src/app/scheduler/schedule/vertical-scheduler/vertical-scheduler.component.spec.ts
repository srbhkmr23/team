import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalSchedulerComponent } from './vertical-scheduler.component';

describe('VerticalSchedulerComponent', () => {
  let component: VerticalSchedulerComponent;
  let fixture: ComponentFixture<VerticalSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerticalSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
