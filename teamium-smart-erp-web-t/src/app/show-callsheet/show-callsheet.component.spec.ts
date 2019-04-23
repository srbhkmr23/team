import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCallsheetComponent } from './show-callsheet.component';

describe('ShowCallsheetComponent', () => {
  let component: ShowCallsheetComponent;
  let fixture: ComponentFixture<ShowCallsheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCallsheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCallsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
