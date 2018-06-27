import { TestBed, inject } from '@angular/core/testing';

import { UberQueryService } from './uber-query.service';

describe('UberQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UberQueryService]
    });
  });

  it('should be created', inject([UberQueryService], (service: UberQueryService) => {
    expect(service).toBeTruthy();
  }));
});
