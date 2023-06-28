import { TestBed } from '@angular/core/testing';

import { TokenHelperService } from './token-helper.service';

describe('AuthService', () => {
  let service: TokenHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
