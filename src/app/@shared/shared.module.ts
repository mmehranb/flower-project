import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxMaskModule } from "ngx-mask";
import { ModalModule } from "./modal/modal.module";
import { SwiperModule } from "ngx-swiper-wrapper";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";

//Components
import { FormFieldComponent } from "./components/form-field/form-field.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CheckBoxComponent } from "./components/check-box/check-box.component";
import { TabComponent } from "./components/tab/tab.component";
import { BenisIntroSlideComponent } from "./components/benis-intro-slide/benis-intro-slide.component";
import { ShopCartItemsComponent } from "./components/shop-cart-items/shop-cart-items.component";
import { DropDownComponent } from "./components/drop-down/drop-down.component";
import { RouterModule } from "@angular/router";
import { CollapseDirective } from "./directives/collapse.directive";
import { ProductCartComponent } from "./components/product-cart/product-cart.component";
import { AddressDetailComponent } from "./components/address-card/address-detail/address-detail.component";
import { AddressCardComponent } from "./components/address-card/address-card.component";
import { PostalCardDetailComponent } from "./components/shop-cart-items/postal-card-detail/postal-card-detail.component";
import { DialogSelectComponent } from "./components/dialog-select/dialog-select.component";
import { ConfirmationComponent } from "./components/confirmation/confirmation.component";
import { SpecialInputComponent } from "./components/special-input/special-input.component";
import { SwitchToggleComponent } from "./components/switch-toggle/switch-toggle.component";
import { LazyLoadDirective } from "./directives/lazy-load.directive";
import { SafeHtmlPipe } from "./pipes/saf-html-pipe.pipe";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    LeafletModule,
    SwiperModule,
    NgxMaskModule.forRoot({
      showMaskTyped: true,
    }),
    RouterModule,
  ],
  declarations: [
    FormFieldComponent,
    CheckBoxComponent,
    TabComponent,
    BenisIntroSlideComponent,
    ShopCartItemsComponent,
    DropDownComponent,
    CollapseDirective,
    ProductCartComponent,
    AddressDetailComponent,
    AddressCardComponent,
    PostalCardDetailComponent,
    ConfirmationComponent,
    DialogSelectComponent,
    SpecialInputComponent,
    SwitchToggleComponent,
    LazyLoadDirective,
    SafeHtmlPipe,
  ],
  exports: [
    FormFieldComponent,
    CheckBoxComponent,
    TabComponent,
    BenisIntroSlideComponent,
    ShopCartItemsComponent,
    DropDownComponent,
    ModalModule,
    CollapseDirective,
    ProductCartComponent,
    AddressCardComponent,
    ConfirmationComponent,
    DialogSelectComponent,
    SpecialInputComponent,
    SwitchToggleComponent,
    LazyLoadDirective,
    SafeHtmlPipe,
  ],
  entryComponents: [AddressDetailComponent, PostalCardDetailComponent],
})
export class SharedModule {}
