import { Component, OnInit } from '@angular/core';
import { CheckoutService } from '@app/@shared/services/checkout.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  myOrders: Array<any>;

  constructor(private checkoutService: CheckoutService) {
    this.checkoutService.getUserOrders().then(r => {
      this.myOrders = r.data;
    })
  }

  ngOnInit(): void {
  }

}
