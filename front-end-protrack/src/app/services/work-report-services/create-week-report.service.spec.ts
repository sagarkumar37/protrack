import { TestBed } from '@angular/core/testing';

import { CreateWeekReportService } from './create-week-report.service';

describe('CreateWeekReportService', () => {
  let service: CreateWeekReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateWeekReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
