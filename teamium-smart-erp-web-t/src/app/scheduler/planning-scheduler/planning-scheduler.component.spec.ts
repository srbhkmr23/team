import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningSchedulerComponent } from './planning-scheduler.component';

describe('PlanningSchedulerComponent', () => {
  let component: PlanningSchedulerComponent;
  let fixture: ComponentFixture<PlanningSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
