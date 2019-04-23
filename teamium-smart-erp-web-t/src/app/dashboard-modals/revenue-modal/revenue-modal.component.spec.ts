import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueModalComponent } from './revenue-modal.component';

describe('RevenueModalComponent', () => {
  let component: RevenueModalComponent;
  let fixture: ComponentFixture<RevenueModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
