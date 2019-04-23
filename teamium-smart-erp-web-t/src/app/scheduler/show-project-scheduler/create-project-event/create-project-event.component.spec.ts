import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectEventComponent } from './create-project-event.component';

describe('CreateProjectEventComponent', () => {
  let component: CreateProjectEventComponent;
  let fixture: ComponentFixture<CreateProjectEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProjectEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
