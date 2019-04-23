import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartTourComponent } from './start-tour.component';

describe('StartTourComponent', () => {
  let component: StartTourComponent;
  let fixture: ComponentFixture<StartTourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartTourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
