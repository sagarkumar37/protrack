import { TestBed } from '@angular/core/testing';

import { FetchPunchInOutTimeService } from './fetch-punch-in-out-time.service';

describe('FetchPunchInOutTimeService', () => {
  let service: FetchPunchInOutTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchPunchInOutTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
