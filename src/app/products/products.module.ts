import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';

import { SharedModule } from "src/app/@shared/shared.module";
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductsService } from "@shared/services/products.service";
import { ProductsFilterComponent } from './products-filter/products-filter.component';


@NgModule({
  declarations: [ProductsComponent, ProductsFilterComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxPaginationModule,
    ProductsRoutingModule,
  ],
  providers: [ ProductsService ],
})
export class ProductsModule { }
