import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveFormatComponent } from './save-format.component';

describe('SaveFormatComponent', () => {
  let component: SaveFormatComponent;
  let fixture: ComponentFixture<SaveFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
