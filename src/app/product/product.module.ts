import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { SharedModule } from '@app/@shared';
import { ProductComponent } from "./product.component";
import { SwiperModule } from 'ngx-swiper-wrapper';


@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    SharedModule,
    SwiperModule,
    ProductRoutingModule
  ]
})
export class ProductModule { }
