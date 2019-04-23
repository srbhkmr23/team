import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectProcurementComponent } from './project-procurement.component';

describe('ProjectProcurementComponent', () => {
  let component: ProjectProcurementComponent;
  let fixture: ComponentFixture<ProjectProcurementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectProcurementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectProcurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
