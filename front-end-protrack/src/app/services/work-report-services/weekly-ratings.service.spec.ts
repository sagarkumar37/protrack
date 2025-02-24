import { TestBed } from '@angular/core/testing';

import { WeeklyRatingsService } from './weekly-ratings.service';

describe('WeeklyRatingsService', () => {
  let service: WeeklyRatingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeeklyRatingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
