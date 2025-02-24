import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekReportComponent } from './week-report.component';

describe('WeekReportComponent', () => {
  let component: WeekReportComponent;
  let fixture: ComponentFixture<WeekReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
