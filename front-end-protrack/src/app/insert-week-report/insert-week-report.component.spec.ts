import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertWeekReportComponent } from './insert-week-report.component';

describe('InsertWeekReportComponent', () => {
  let component: InsertWeekReportComponent;
  let fixture: ComponentFixture<InsertWeekReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertWeekReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertWeekReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
