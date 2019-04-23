import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComingSoonComponent } from './list-coming-soon.component';

describe('ListComingSoonComponent', () => {
  let component: ListComingSoonComponent;
  let fixture: ComponentFixture<ListComingSoonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListComingSoonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComingSoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
