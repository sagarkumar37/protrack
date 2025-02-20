import { TestBed } from '@angular/core/testing';

import { LoginapiService } from './loginapi.service';

describe('LoginapiService', () => {
  let service: LoginapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
