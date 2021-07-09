import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from "@app/shell/shell.service";

//Components
import { CheckoutComponent } from "./checkout.component";
import { ShopCartComponent } from "./shop-cart/shop-cart.component";
import { ShippingComponent } from "./shipping/shipping.component";
import { AccessoryComponent } from "./accessory/accessory.component";
import { PaymentComponent } from "./payment/payment.component";
import { AuthenticationGuard } from "@shared/guards/authentication.guard";
import { ResultComponent } from "./result/result.component";
import { ShopCartGuard } from '@app/@shared/guards/shop-cart.guard';

const routes: Routes = [
  {
    path: '',
    component: CheckoutComponent, // base template component
    children: [
      {
        path: "shipping",
        canActivate: [AuthenticationGuard, ShopCartGuard],
        component: ShippingComponent,
        data: { title: 'اطلاعات ارسال', step: 1 }
      },
      {
        path: "accessory",
        canActivate: [AuthenticationGuard, ShopCartGuard],
        component: AccessoryComponent,
        data: { title: 'اطلاعات ارسال', step: 2 }
      },
      {
        path: "payment",
        canActivate: [AuthenticationGuard, ShopCartGuard],
        component: PaymentComponent,
        data: { title: 'اطلاعات ارسال', step: 3 }
      },
      {
        path: "shop-cart",
        component: ShopCartComponent
      },
      {
        path: "result/:orderId",
        component: ResultComponent,
        data: { title: 'اطلاعات ارسال', step: 4 }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
