import { TestBed } from '@angular/core/testing';

import { TimesheetReportService } from './timesheet-report.service';

describe('TimesheetReportService', () => {
  let service: TimesheetReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimesheetReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
