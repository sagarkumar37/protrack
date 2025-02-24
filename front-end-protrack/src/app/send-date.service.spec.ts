import { TestBed } from '@angular/core/testing';

import { SendDateService } from './send-date.service';

describe('SendDateService', () => {
  let service: SendDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
