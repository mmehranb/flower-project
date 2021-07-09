import { Component, OnInit } from "@angular/core";
import { ProductsService } from "@app/@shared/services/products.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SwiperConfigInterface } from "ngx-swiper-wrapper";
import { CheckoutService } from "@app/@shared/services/checkout.service";
import { NgxSmartModalService } from "ngx-smart-modal";
import { ShopCartService } from "@app/@shared/services/shop-cart.service";
import { environment } from "@env/environment";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "postal-card-detail",
  templateUrl: "./postal-card-detail.component.html",
  styleUrls: ["./postal-card-detail.component.scss"],
})
export class PostalCardDetailComponent implements OnInit {
  postalCarts: Array<any>;
  form: FormGroup;
  dialogData: any;
  suggestionItems: Array<any>;

  public postalCartsConfig: SwiperConfigInterface = {
    slidesPerView: 2.5,
    spaceBetween: 0,
    lazy: true,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    breakpoints: {
      760: {
        slidesPerView: 1.5,
      },
    },
  };

  constructor(
    private productsService: ProductsService,
    private formBuilder: FormBuilder,
    private shopCartService: ShopCartService,
    private ngxSmartModalService: NgxSmartModalService,
    private toastr: ToastrService
  ) {
    this.dialogData = this.ngxSmartModalService.getModalData("ctrlPostalCard");
    this.form = this.formBuilder.group({
      postalcard_id: [
        (this.dialogData.postalCard && this.dialogData.postalCard.pivot.postalcard_id) || null,
        Validators.required,
      ],
      postalcard_text: [
        (this.dialogData.postalCard && this.dialogData.postalCard.pivot.postalcard_text) || null,
        Validators.required,
      ],
      picurl: [(this.dialogData.postalCard && this.dialogData.postalCard.picurl) || null],
    });
    this.productsService.getPostalCards().then((r) => {
      this.postalCarts = r.data;
      this.postalCarts.sort((x: any, y: any) => {
        if (x.sort_order < y.sort_order) {
          return -1;
        } else if (x.sort_order < y.sort_order) {
          return 1;
        }
        return 0;
      });
    });
  }

  ngOnInit(): void {}

  patchPostalCard(postalCard: any) {
    this.form.controls["postalcard_id"].patchValue(postalCard.postalcart_id);
    this.form.controls["picurl"].patchValue(postalCard.picurl);
  }

  submit() {
    if (this.form.valid) {
      this.ngxSmartModalService.setModalData(this.form.value, "ctrlPostalCard", true);
      this.ngxSmartModalService.close("ctrlPostalCard");
    } else {
      this.toastr.error("انتخاب کارت پستال و ثبت متن اجباری می باشد", "خطا");
    }
  }

  showSuggestion() {
    this.shopCartService.getSuggestionText().then((r) => {
      this.suggestionItems = r.data;
    });
  }

  getImageUrl(x: string) {
    return environment.CDN + `/${x}`;
  }

  selectSuggestion(e: any) {
    this.form.controls["postalcard_text"].patchValue(e);
  }
}
