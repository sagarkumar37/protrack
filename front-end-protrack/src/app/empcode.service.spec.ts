import { TestBed } from '@angular/core/testing';

import { EmpcodeService } from './empcode.service';

describe('EmpcodeService', () => {
  let service: EmpcodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpcodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
