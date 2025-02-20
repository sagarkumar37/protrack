import { TestBed } from '@angular/core/testing';

import { BreakTimeService } from './break-time.service';

describe('BreakTimeService', () => {
  let service: BreakTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreakTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
