import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWeekReportComponent } from './view-week-report.component';

describe('ViewWeekReportComponent', () => {
  let component: ViewWeekReportComponent;
  let fixture: ComponentFixture<ViewWeekReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewWeekReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWeekReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
