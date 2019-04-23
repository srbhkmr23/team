import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordMyaccountComponent } from './reset-password-myaccount.component';

describe('ResetPasswordMyaccountComponent', () => {
  let component: ResetPasswordMyaccountComponent;
  let fixture: ComponentFixture<ResetPasswordMyaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordMyaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordMyaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
