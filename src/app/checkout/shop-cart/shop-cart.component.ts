import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CheckoutService } from '@app/@shared/services/checkout.service';

@Component({
  selector: 'app-shop-cart',
  templateUrl: './shop-cart.component.html',
  styleUrls: ['./shop-cart.component.scss']
})
export class ShopCartComponent implements OnInit, OnDestroy {
	private subscriptions = new Subscription();

  constructor(public router: Router, private checkoutService: CheckoutService) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.checkoutService.getSubmitAction().subscribe(r => {
        this.next();
      })
    )
  }

  next() {
    this.router.navigateByUrl("/checkout/shipping");
  }

  ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
