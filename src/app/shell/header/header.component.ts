import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSmartModalService } from "ngx-smart-modal";
import { AuthenticationService } from "@app/auth";
import { CredentialsService } from "@shared/services/credentials.service";
import { CtrlModalService } from '@app/@shared/modal/ctrl-modal.service';
import { ShopCartItemsComponent } from "@shared/components/shop-cart-items/shop-cart-items.component";
import { MenuComponent } from "./menu/menu.component";
import { StaticDataService } from '@app/@shared/services/static-data.service';
import { CheckoutService } from '@app/@shared/services/checkout.service';
import { CookieService } from 'ngx-cookie-service';
import { ShopCartService } from '@app/@shared/services/shop-cart.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  menuHidden = true;
  userInfo: any;
  config: any;
  shopCartItemNumber: number;

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private ngxSmartModalService: NgxSmartModalService,
    private ctrlModalService: CtrlModalService,
    private staticDataService: StaticDataService,
    private checkoutService: CheckoutService,
    private shopCartService: ShopCartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.shopCartItemNumber = JSON.parse(localStorage.getItem("shopCart") || "[]").length;
    this.staticDataService.getSiteConfig().subscribe((r: any) => {
      this.config = r.data[0];
    })
    this.authenticationService.getUserInfo().subscribe(r => {
      if (r)
        this.userInfo = r.data;
    })
    this.shopCartService.getBasketItemsNumber().subscribe((r: number) => {
      this.shopCartItemNumber = r;
    })
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(["/auth/login"], { replaceUrl: true }));
  }

  login() {
    this.router.navigate(['/auth/login'], { queryParams: { redirect: window.location.pathname }, replaceUrl: true });
  }

  showMenu() {
    const dialog = this.ngxSmartModalService.create(
      "menu",
      MenuComponent,
      this.ctrlModalService.sideOption()
    );
    dialog.open()
  }

  showShopCart() {
    const dialog = this.ngxSmartModalService.create(
      "shopCart",
      ShopCartItemsComponent,
      this.ctrlModalService.sideOption()
    );
    dialog.open()
  }

  search(e: any) {
    if (e) {
      this.router.navigate(['/products/search'], { queryParams: { name: e } });
    }
    else {
      this.router.navigateByUrl('/products')
    }
  }
}
