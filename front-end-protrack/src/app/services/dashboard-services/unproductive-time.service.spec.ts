import { TestBed } from '@angular/core/testing';

import { UnproductiveTimeService } from './unproductive-time.service';

describe('UnproductiveTimeService', () => {
  let service: UnproductiveTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnproductiveTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
