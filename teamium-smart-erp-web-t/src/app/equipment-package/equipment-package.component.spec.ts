import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentPackageComponent } from './equipment-package.component';

describe('EquipmentPackageComponent', () => {
  let component: EquipmentPackageComponent;
  let fixture: ComponentFixture<EquipmentPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
