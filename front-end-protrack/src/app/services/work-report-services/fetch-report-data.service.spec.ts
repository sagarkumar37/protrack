import { TestBed } from '@angular/core/testing';

import { FetchReportDataService } from './fetch-report-data.service';

describe('FetchReportDataService', () => {
  let service: FetchReportDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchReportDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
