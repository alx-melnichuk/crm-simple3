import { TestBed } from '@angular/core/testing';

import { TaskListResolverService } from './task-list-resolver.service';

describe('TaskListResolverService', () => {
  let service: TaskListResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskListResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
