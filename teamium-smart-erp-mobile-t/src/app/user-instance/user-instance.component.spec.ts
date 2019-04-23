import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInstanceComponent } from './user-instance.component';

describe('UserInstanceComponent', () => {
  let component: UserInstanceComponent;
  let fixture: ComponentFixture<UserInstanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInstanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
