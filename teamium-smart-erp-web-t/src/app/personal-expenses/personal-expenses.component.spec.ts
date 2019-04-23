import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalExpensesComponent } from './personal-expenses.component';

describe('PersonalExpensesComponent', () => {
  let component: PersonalExpensesComponent;
  let fixture: ComponentFixture<PersonalExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
