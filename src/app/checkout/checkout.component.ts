import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CheckoutService } from "@app/@shared/services/checkout.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit {
  factorInfo: any;
  pageConfig: any;

  constructor(
    public router: Router,
    private checkoutService: CheckoutService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.checkoutService.getFactor().subscribe((r) => {
      this.factorInfo = r;
      if (!r.basket.length) {
        this.toastr.success("تمام محصولات از سبد خرید حذف شدن", "موفق");
        this.router.navigateByUrl('/');
      }
    });
  }

  ngOnInit(): void {
    // this.router.navigateByUrl("/checkout/shipping");
  }

  onActivate(e: any) {
    this.pageConfig = this.route.snapshot.firstChild.data;
  }

  next() {
    this.checkoutService.callSubmitAction();
  }
}
