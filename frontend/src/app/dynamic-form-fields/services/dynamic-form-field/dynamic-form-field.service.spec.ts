import { TestBed } from '@angular/core/testing';

import { DynamicFormFieldService } from './dynamic-form-field.service';

describe('DynamicFormFieldService', () => {
  let service: DynamicFormFieldService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicFormFieldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
