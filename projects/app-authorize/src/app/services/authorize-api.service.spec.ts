import { TestBed } from '@angular/core/testing';

import { AuthorizeApiService } from './authorize-api.service';

describe('AuthorizeApiService', () => {
  let service: AuthorizeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
