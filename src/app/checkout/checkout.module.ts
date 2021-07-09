import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from "@shared/shared.module";
import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutHeaderComponent } from './checkout-header/checkout-header.component';
import { ShopCartComponent } from './shop-cart/shop-cart.component';
import { CheckoutComponent } from './checkout.component';
import { AccessoryComponent } from './accessory/accessory.component';
import { ShippingComponent } from './shipping/shipping.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentComponent } from './payment/payment.component';
import { ResultComponent } from './result/result.component';
import { DpDatePickerModule } from '@app/@shared/datePicker';


@NgModule({
  declarations: [CheckoutHeaderComponent, ShopCartComponent, CheckoutComponent, AccessoryComponent, ShippingComponent, PaymentComponent, ResultComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DpDatePickerModule,
    CheckoutRoutingModule
  ]
})
export class CheckoutModule { }
