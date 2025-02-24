import { TestBed } from '@angular/core/testing';

import { TimesheetFlagService } from './timesheet-flag.service';

describe('TimesheetFlagService', () => {
  let service: TimesheetFlagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimesheetFlagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
