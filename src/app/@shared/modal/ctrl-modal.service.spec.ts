import { TestBed } from '@angular/core/testing';

import { CtrlModalService } from './ctrl-modal.service';

describe('CtrlModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CtrlModalService = TestBed.get(CtrlModalService);
    expect(service).toBeTruthy();
  });
});
