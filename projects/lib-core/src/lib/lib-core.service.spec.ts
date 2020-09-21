import { TestBed } from '@angular/core/testing';

import { LibCoreService } from './lib-core.service';

describe('LibCoreService', () => {
  let service: LibCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
