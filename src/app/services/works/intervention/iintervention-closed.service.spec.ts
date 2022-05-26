import { TestBed } from '@angular/core/testing';

import { IinterventionClosedService } from './intervention-closed.service';

describe('IinterventionClosedService', () => {
  let service: IinterventionClosedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IinterventionClosedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
