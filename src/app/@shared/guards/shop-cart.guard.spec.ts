import { TestBed } from '@angular/core/testing';

import { ShopCartGuard } from './shop-cart.guard';

describe('ShopCartGuard', () => {
  let guard: ShopCartGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ShopCartGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
