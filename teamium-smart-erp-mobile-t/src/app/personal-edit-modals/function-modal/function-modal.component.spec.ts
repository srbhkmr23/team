import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionModalComponent } from './function-modal.component';

describe('FunctionModalComponent', () => {
  let component: FunctionModalComponent;
  let fixture: ComponentFixture<FunctionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
