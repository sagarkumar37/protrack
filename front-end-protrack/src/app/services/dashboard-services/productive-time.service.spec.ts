import { TestBed } from '@angular/core/testing';

import { ProductiveTimeService } from './productive-time.service';

describe('ProductiveTimeService', () => {
  let service: ProductiveTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductiveTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
