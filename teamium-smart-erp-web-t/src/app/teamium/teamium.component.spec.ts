import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamiumComponent } from './teamium.component';

describe('TeamiumComponent', () => {
  let component: TeamiumComponent;
  let fixture: ComponentFixture<TeamiumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamiumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
