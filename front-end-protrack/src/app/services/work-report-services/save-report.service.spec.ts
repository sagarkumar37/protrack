import { TestBed } from '@angular/core/testing';

import { SaveReportService } from './save-report.service';

describe('SaveReportService', () => {
  let service: SaveReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
