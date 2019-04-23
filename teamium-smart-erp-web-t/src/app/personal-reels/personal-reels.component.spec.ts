import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalReelsComponent } from './personal-reels.component';

describe('PersonalReelsComponent', () => {
  let component: PersonalReelsComponent;
  let fixture: ComponentFixture<PersonalReelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalReelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalReelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
