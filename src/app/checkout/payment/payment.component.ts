import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { CheckoutService } from "@app/@shared/services/checkout.service";
import { LoadingService } from "@app/@shared/services/loading.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ShopCartService } from "@app/@shared/services/shop-cart.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
})
export class PaymentComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  form: FormGroup;
  order: any;
  ipgTypes: Array<any>;

  constructor(
    private checkoutService: CheckoutService,
    private loading: LoadingService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private shopCartService: ShopCartService,
    private router: Router
  ) {
    this.order = this.checkoutService.getOrder();
    this.checkoutService.factorApiCall();
    this.subscriptions.add(
      this.checkoutService.getSubmitAction().subscribe((r) => {
        this.next();
      })
    );
    this.form = this.formBuilder.group({
      coupon_name: [null],
      payment_method_id: [null, Validators.required],
    });
    this.checkoutService.getIpgTypes().then((r: any) => {
      this.ipgTypes = r.data;
      this.form.controls["payment_method_id"].patchValue(r.data[0].payment_method_id);
    });
  }

  ngOnInit(): void {}

  checkDiscount() {
    this.order.coupon_name = this.form.value.coupon_name;
    this.checkoutService.saveOrder(this.order);
    this.checkoutService.factorApiCall().then((r: any) => {
      if (r.main.coupon_id) {
        this.order.coupon_id = r.main.coupon_id;
        this.checkoutService.saveOrder(this.order);
      } else {
        this.toastr.error(r.main.coupon_msg, "خطا");
      }
    });
  }

  chooseIpgType(type: any) {
    this.form.controls["payment_method_id"].patchValue(type);
  }
  next() {
    this.loading.show();
    this.checkoutService.addOrder(this.order).then((r) => {
      this.order.orderId = r.data;
      this.checkoutService.saveOrder(this.order);
      this.shopCartService.clearBasket();
      this.checkoutService
        .addPayment({ order_id: this.order.orderId, payment_method_id: this.form.value.payment_method_id })
        .then(
          (r) => {
            this.loading.complete();
            window.location.href = r.data;
          },
          (error) => {
            this.toastr.error(
              "در اتصال به بانک مشکلی پیش امده لطفا جهت ادامه خرید از لیست سفارشات اقدام کنید یا مجددا سفارش را ثبت کنید",
              "خطا"
            );
            this.router.navigateByUrl("/");
          }
        );
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
