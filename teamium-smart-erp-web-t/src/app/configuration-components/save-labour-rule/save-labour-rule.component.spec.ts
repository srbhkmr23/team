import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveLabourRuleComponent } from './save-labour-rule.component';

describe('SaveLabourRuleComponent', () => {
  let component: SaveLabourRuleComponent;
  let fixture: ComponentFixture<SaveLabourRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveLabourRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveLabourRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
