import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavePersonnelSkillComponent } from './save-personnel-skill.component';

describe('SavePersonnelSkillComponent', () => {
  let component: SavePersonnelSkillComponent;
  let fixture: ComponentFixture<SavePersonnelSkillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavePersonnelSkillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavePersonnelSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
