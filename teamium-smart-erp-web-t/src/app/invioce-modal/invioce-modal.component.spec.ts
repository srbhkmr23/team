import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioceModalComponent } from './invioce-modal.component';

describe('InvioceModalComponent', () => {
  let component: InvioceModalComponent;
  let fixture: ComponentFixture<InvioceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvioceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvioceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
