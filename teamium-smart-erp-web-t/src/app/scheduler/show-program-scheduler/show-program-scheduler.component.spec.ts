import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProgramSchedulerComponent } from './show-program-scheduler.component';

describe('ShowProgramSchedulerComponent', () => {
  let component: ShowProgramSchedulerComponent;
  let fixture: ComponentFixture<ShowProgramSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowProgramSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowProgramSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
