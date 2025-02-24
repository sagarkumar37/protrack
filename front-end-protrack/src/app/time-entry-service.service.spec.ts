import { TestBed } from '@angular/core/testing';

import { TimeEntryServiceService } from './time-entry-service.service';

describe('TimeEntryServiceService', () => {
  let service: TimeEntryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeEntryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
