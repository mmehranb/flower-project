import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MiddlewareService } from "@app/@shared/services/middleware.service";
import { LoadingService } from "@app/@shared/services/loading.service";
import { ToastrService } from "ngx-toastr";
import { CheckoutService } from '@app/@shared/services/checkout.service';
import { ShopCartService } from '@app/@shared/services/shop-cart.service';
import { environment } from "@env/environment";
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
@Component({
  selector: "product-cart",
  templateUrl: "./product-cart.component.html",
  styleUrls: ["./product-cart.component.scss"],
})
export class ProductCartComponent implements OnInit {
  @Output() onAddToBasket = new EventEmitter<any>();
  @Output() onWishChange = new EventEmitter<any>();
  @Input() productInfo: any;
  @Input() onlyAddAction: boolean = false;

  constructor(
    private middlewareService: MiddlewareService,
    private loading: LoadingService,
    private checkoutService: CheckoutService,
    private router: Router,
    private toastr: ToastrService,
    private shopCartService: ShopCartService
  ) {}

  ngOnInit(): void {}

  ctrlItemInWishList(productid: number, isInWishList: boolean) {
    if (isInWishList) {
      this.middlewareService.deleteMiddleware(`public/wishproduct/remove/${productid}`).subscribe((r) => {
        this.productInfo.is_whishlist = 0
        this.onWishChange.emit();
        this.toastr.success("محصول مورد نظراز لیست علاقمندی های شما حذف شد", "عملیات موفق");
      });
    } else {
      this.middlewareService.postMiddleware("public/wishproduct/add", { productid }).subscribe((r) => {
        this.productInfo.is_whishlist = 1
        this.onWishChange.emit();
        this.toastr.success("محصول مورد نظر به لیست علاقمندی های شما افزوده شد", "عملیات موفق");
      });
    }
  }

  addItemToBasket(product: any) {
    if (product.optioncount) {
      this.router.navigateByUrl('/product/' + product.cleanurl + '/' + product.product_id)
      return;
    }
    this.loading.show();
    this.shopCartService.addBasket(
      {
        product_id: product.product_id,
        image_url: product.imageurl,
        image: product.image,
        name: product.name,
        price: product.price,
        calc_price: product.calc_price
      },
      1
    ).then(r => {
      this.loading.complete();
      this.toastr.success("محصول مورد نظر با موفقیت به سبد خرید اضافه شد", "عملیات موفق");
      this.onAddToBasket.emit();
      if (r) {
        this.shopCartService.getBasket();
      }
    });
  }

  getImageUrl(x: string) {
    return environment.CDN + `/${x}`;
  }
}
