import { TestBed } from '@angular/core/testing';

import { EmpnameService } from './empname.service';

describe('EmpnameService', () => {
  let service: EmpnameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpnameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
