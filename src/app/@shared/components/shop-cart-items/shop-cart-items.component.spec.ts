import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopCartItemsComponent } from './shop-cart-items.component';

describe('ShopCartItemsComponent', () => {
  let component: ShopCartItemsComponent;
  let fixture: ComponentFixture<ShopCartItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopCartItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopCartItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
