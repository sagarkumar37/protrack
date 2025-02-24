import { TestBed } from '@angular/core/testing';

import { FetchPunchoutTimeService } from './fetch-punchout-time.service';

describe('FetchPunchoutTimeService', () => {
  let service: FetchPunchoutTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchPunchoutTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
