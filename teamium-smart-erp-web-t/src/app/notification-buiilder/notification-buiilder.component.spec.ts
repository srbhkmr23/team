import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationBuiilderComponent } from './notification-buiilder.component';

describe('NotificationBuiilderComponent', () => {
  let component: NotificationBuiilderComponent;
  let fixture: ComponentFixture<NotificationBuiilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationBuiilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationBuiilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
