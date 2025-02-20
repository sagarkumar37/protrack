import { TestBed } from '@angular/core/testing';

import { FetchTasksService } from './fetch-tasks.service';

describe('FetchTasksService', () => {
  let service: FetchTasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchTasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
