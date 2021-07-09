import { Route } from '@angular/compiler/src/core';
import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ShopCartGuard implements CanActivate {
  constructor(
    private toastr: ToastrService,
    private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const shopCart = JSON.parse(localStorage.getItem("shopCart"));
    if (shopCart && shopCart.length) {
      return true;
    } else {
      this.toastr.error("سبد خرید شما خالی میباشد لطفا برای ادامه مراحل محصولی را انتخاب نمایید", "خطا");
      this.router.navigateByUrl('/');
      return false;
    }
  }
}
