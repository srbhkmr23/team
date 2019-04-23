import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBudgetingComponent } from './project-budgeting.component';

describe('ProjectBudgetingComponent', () => {
  let component: ProjectBudgetingComponent;
  let fixture: ComponentFixture<ProjectBudgetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectBudgetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBudgetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
