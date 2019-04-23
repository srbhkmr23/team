import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShowComponent } from './create-show.component';

describe('CreateShowComponent', () => {
  let component: CreateShowComponent;
  let fixture: ComponentFixture<CreateShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
