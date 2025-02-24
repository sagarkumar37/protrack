import { TestBed } from '@angular/core/testing';

import { TotalTimeTrackedService } from './total-time-tracked.service';

describe('TotalTimeTrackedService', () => {
  let service: TotalTimeTrackedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TotalTimeTrackedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
