import { TestBed } from '@angular/core/testing';

import { FetchUserRoleService } from './fetch-user-role.service';

describe('FetchUserRoleService', () => {
  let service: FetchUserRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchUserRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
