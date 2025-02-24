import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyPlanComponent } from './weekly-plan.component';

describe('WeeklyPlanComponent', () => {
  let component: WeeklyPlanComponent;
  let fixture: ComponentFixture<WeeklyPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
