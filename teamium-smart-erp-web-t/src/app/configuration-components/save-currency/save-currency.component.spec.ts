import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveCurrencyComponent } from './save-currency.component';

describe('SaveCurrencyComponent', () => {
  let component: SaveCurrencyComponent;
  let fixture: ComponentFixture<SaveCurrencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveCurrencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
