import { TestBed, inject } from '@angular/core/testing';

import { SubResourceService } from './sub-resource.service';

describe('SubResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubResourceService]
    });
  });

  it('should be created', inject([SubResourceService], (service: SubResourceService) => {
    expect(service).toBeTruthy();
  }));
});
