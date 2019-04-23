import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessFunctionModalComponent } from './business-function-modal.component';

describe('BusinessFunctionModalComponent', () => {
  let component: BusinessFunctionModalComponent;
  let fixture: ComponentFixture<BusinessFunctionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessFunctionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessFunctionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
