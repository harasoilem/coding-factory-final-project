import { TestBed } from '@angular/core/testing';

import { CrudSimpleService } from './crud-simple.service';

describe('CrudSimpleService', () => {
  let service: CrudSimpleService<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudSimpleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
