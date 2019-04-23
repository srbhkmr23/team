import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectBudgetingComponent } from './create-project-budgeting.component';

describe('CreateProjectBudgetingComponent', () => {
  let component: CreateProjectBudgetingComponent;
  let fixture: ComponentFixture<CreateProjectBudgetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProjectBudgetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectBudgetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
