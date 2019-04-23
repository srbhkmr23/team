import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveEquipmentMilestonesComponent } from './save-equipment-milestones.component';

describe('SaveEquipmentMilestonesComponent', () => {
  let component: SaveEquipmentMilestonesComponent;
  let fixture: ComponentFixture<SaveEquipmentMilestonesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveEquipmentMilestonesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveEquipmentMilestonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
