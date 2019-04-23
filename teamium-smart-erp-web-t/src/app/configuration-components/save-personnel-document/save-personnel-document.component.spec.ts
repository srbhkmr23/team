import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavePersonnelDocumentComponent } from './save-personnel-document.component';

describe('SavePersonnelDocumentComponent', () => {
  let component: SavePersonnelDocumentComponent;
  let fixture: ComponentFixture<SavePersonnelDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavePersonnelDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavePersonnelDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
