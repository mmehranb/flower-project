import { Component, OnInit } from '@angular/core';
import { CheckoutService } from '@app/@shared/services/checkout.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  orderDetail: any;

  constructor(
    private checkoutService: CheckoutService,
    private route: ActivatedRoute
  ) {
    this.checkoutService.getOrderDetail(this.route.snapshot.params['id']).then(r => {
      this.orderDetail = r.data[0];
    })
  }

  ngOnInit(): void {
  }

}
