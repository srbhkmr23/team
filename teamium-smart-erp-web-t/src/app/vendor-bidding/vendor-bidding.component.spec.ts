import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorBiddingComponent } from './vendor-bidding.component';

describe('VendorBiddingComponent', () => {
  let component: VendorBiddingComponent;
  let fixture: ComponentFixture<VendorBiddingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorBiddingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorBiddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
