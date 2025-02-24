import { TestBed } from '@angular/core/testing';

import { LearningTimeService } from './learning-time.service';

describe('LearningTimeService', () => {
  let service: LearningTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearningTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
