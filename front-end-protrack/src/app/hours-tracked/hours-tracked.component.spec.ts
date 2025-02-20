import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursTrackedComponent } from './hours-tracked.component';

describe('HoursTrackedComponent', () => {
  let component: HoursTrackedComponent;
  let fixture: ComponentFixture<HoursTrackedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoursTrackedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoursTrackedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
