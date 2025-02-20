import { TestBed } from '@angular/core/testing';

import { FetchPunchinTimeService } from './fetch-punchin-time.service';

describe('FetchPunchinTimeService', () => {
  let service: FetchPunchinTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchPunchinTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
