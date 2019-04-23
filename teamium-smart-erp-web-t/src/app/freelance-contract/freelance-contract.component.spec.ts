import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelanceContractComponent } from './freelance-contract.component';

describe('FreelanceContractComponent', () => {
  let component: FreelanceContractComponent;
  let fixture: ComponentFixture<FreelanceContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelanceContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelanceContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
