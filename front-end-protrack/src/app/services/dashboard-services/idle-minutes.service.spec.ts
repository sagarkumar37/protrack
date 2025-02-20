import { TestBed } from '@angular/core/testing';

import { IdleMinutesService } from './idle-minutes.service';

describe('IdleMinutesService', () => {
  let service: IdleMinutesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdleMinutesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
