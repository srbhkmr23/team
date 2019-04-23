import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveKeywordComponent } from './save-keyword.component';

describe('SaveKeywordComponent', () => {
  let component: SaveKeywordComponent;
  let fixture: ComponentFixture<SaveKeywordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveKeywordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveKeywordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
