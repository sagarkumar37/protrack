import { TestBed } from '@angular/core/testing';

import { RedashService } from './redash.service';

describe('RedashService', () => {
  let service: RedashService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedashService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
