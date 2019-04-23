import { TestBed, inject } from '@angular/core/testing';

import { InstanceGuardService } from './instance-guard.service';

describe('InstanceGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstanceGuardService]
    });
  });

  it('should be created', inject([InstanceGuardService], (service: InstanceGuardService) => {
    expect(service).toBeTruthy();
  }));
});
