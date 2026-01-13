import { TestBed } from '@angular/core/testing';

import { AttendanceRegularizationService } from './attendance-regularization.service';

describe('AttendanceRegularizationService', () => {
  let service: AttendanceRegularizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceRegularizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
