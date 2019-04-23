import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAgendaComponent } from './project-agenda.component';

describe('ProjectAgendaComponent', () => {
  let component: ProjectAgendaComponent;
  let fixture: ComponentFixture<ProjectAgendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectAgendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
