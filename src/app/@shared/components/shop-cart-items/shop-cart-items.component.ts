import { Component, OnInit, Input } from "@angular/core";
import { CheckoutService } from "@app/@shared/services/checkout.service";
import { ProductsService } from "@app/@shared/services/products.service";
import { PostalCardDetailComponent } from "./postal-card-detail/postal-card-detail.component";
import { NgxSmartModalService, NgxSmartModalComponent } from "ngx-smart-modal";
import { CtrlModalService } from "@app/@shared/modal/ctrl-modal.service";
import { LoadingService } from "@app/@shared/services/loading.service";
import { CookieService } from "ngx-cookie-service";
import { ShopCartService } from "@app/@shared/services/shop-cart.service";
import { environment } from '@env/environment';

@Component({
  selector: "shop-cart-items",
  templateUrl: "./shop-cart-items.component.html",
  styleUrls: ["./shop-cart-items.component.scss"],
})
export class ShopCartItemsComponent implements OnInit {
  @Input() useInModal: boolean = true;
  basketItems: Array<any>;
  totalPrice: number;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private ctrlModalService: CtrlModalService,
    private loading: LoadingService,
    private shopCartService: ShopCartService
  ) {
    this.basketItems = JSON.parse(localStorage.getItem("shopCart") || "[]");
    this.calculateTotalPrice();
  }

  ngOnInit(): void {}

  ctrlCartPostal(shopCartId: number, postalCard?: any) {
    const obj: object = {
      postalCard: postalCard || null,
    };
    const dialog = this.ngxSmartModalService.create(
      "ctrlPostalCard",
      PostalCardDetailComponent,
      this.ctrlModalService.centerOption()
    );
    dialog
      .setData(obj)
      .open()
      .onClose.subscribe((modal: NgxSmartModalComponent) => {
        const data = modal.getData()
        if (postalCard) {
          this.shopCartService.editPostalCard(shopCartId, data).then((r) => {
            this.basketItems = r;
          });
        } else {
          this.shopCartService.addPostalCard(shopCartId, data).then((r) => {
            this.basketItems = r;
          });
        }
      });
  }

  calculateTotalPrice() {
    this.totalPrice = 0;
    this.basketItems.forEach(item => {
      this.totalPrice += item.calc_price
    })
  }
  updateBasketCart(cartId: number, quantity: number) {
    this.shopCartService.updateBasket(cartId, quantity).then((r) => {
      this.basketItems = r;
      this.calculateTotalPrice();
    });
  }

  deleteBasket(cartId: number) {
    this.shopCartService.deleteBasket(cartId).then((r) => {
      this.basketItems = r;
      this.calculateTotalPrice();
    });
  }

  closeShopCart() {
    this.ngxSmartModalService.close("shopCart");
  }

  getImageUrl(x: string) {
    return environment.CDN + `/${x}`;
  }
}
