import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarToggleComponent } from './sidebar-toggle.component';

describe('SidebarToggleComponent', () => {
  let component: SidebarToggleComponent;
  let fixture: ComponentFixture<SidebarToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
