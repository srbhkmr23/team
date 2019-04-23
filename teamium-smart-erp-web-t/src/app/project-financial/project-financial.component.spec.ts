import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFinancialComponent } from './project-financial.component';

describe('ProjectFinancialComponent', () => {
  let component: ProjectFinancialComponent;
  let fixture: ComponentFixture<ProjectFinancialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectFinancialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
