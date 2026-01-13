import { TestBed } from '@angular/core/testing';

import { EmpLogsService } from './emp-logs.service';

describe('EmpLogsService', () => {
  let service: EmpLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
