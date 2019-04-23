import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveProjectMilestonesComponent } from './save-project-milestones.component';

describe('SaveProjectMilestonesComponent', () => {
  let component: SaveProjectMilestonesComponent;
  let fixture: ComponentFixture<SaveProjectMilestonesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveProjectMilestonesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveProjectMilestonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
