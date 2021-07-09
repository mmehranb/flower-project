import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SwiperConfigInterface, SwiperDirective } from "ngx-swiper-wrapper";
import { LoadingService } from "@app/@shared/services/loading.service";
import { ToastrService } from "ngx-toastr";
import { ShopCartService } from "@app/@shared/services/shop-cart.service";
import { ProductsService } from "@app/@shared/services/products.service";
import { CredentialsService } from "@app/@shared/services/credentials.service";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { environment } from "@env/environment";
import { MiddlewareService } from "@app/@shared/services/middleware.service";
import { Meta, Title } from "@angular/platform-browser";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit {
  @ViewChild("galleryImages") galleryImages?: SwiperDirective;
  productOption: string;
  form: FormGroup;
  text: FormControl;
  productOptions: Array<any>;
  lastSeenItems: Array<any>;
  public galleryConfig: SwiperConfigInterface = {
    slidesPerView: 1,
    allowTouchMove: true,
    loop: true,
    spaceBetween: 15,
    autoplay: {
      delay: 4000,
    },
    pagination: {
      el: ".productSliderBullet",
      clickable: true,
      hideOnClick: false,
    },
  };
  public relatedProductConfig: SwiperConfigInterface = {
    slidesPerView: 5.5,
    allowTouchMove: true,
    spaceBetween: 15,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    autoplay: {
      delay: 4000,
    },
    breakpoints: {
      767: {
        slidesPerView: 2.5,
      },
      1024: {
        slidesPerView: 4.5,
      },
    },
  };
  productInfo: any;
  activeTab: number = 1;
  tabItems = [
    {
      title: "درباره محصول",
      id: 1,
    },
    {
      title: "نگهداری",
      id: 2,
    },
    {
      title: "نظرات",
      id: 3,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private loading: LoadingService,
    private shopCartService: ShopCartService,
    private productsService: ProductsService,
    private credentialsService: CredentialsService,
    private middlewareService: MiddlewareService,
    private title: Title,
    private meta: Meta,
    private router: Router
  ) {
    this.form = new FormGroup({});
    this.text = new FormControl(null, Validators.required);
  }

  ngOnInit(): void {
    this.route.url.subscribe((r) => {
      this.lastSeenItems = [];
      this.productInfo = this.route.snapshot.data["product"];
      this.productInfo.images = [
        {
          image: this.productInfo.image,
          title: this.productInfo.image_text,
        },
        ...this.productInfo.images,
      ];
      this.title.setTitle(this.productInfo["meta_title"]);
      this.meta.updateTag({ name: "keywords", content: this.productInfo["meta_keyword"] });
      this.meta.updateTag({ name: "description", content: this.productInfo["meta_description"] });
      this.meta.updateTag({ name: "twitter:description", content: this.productInfo["meta_description"] });
      this.meta.updateTag({ property: "og:description", content: this.productInfo["meta_description"] });
      this.meta.updateTag({ property: "og:title", content: this.productInfo["meta_title"] });
      this.meta.updateTag({ property: "twitter:title", content: this.productInfo["meta_title"] });
      this.getCurrentProductOptions();
      if (this.credentialsService.isAuthenticated()) {
        this.form.addControl("text", this.text);
      }
      this.productsService.getLastSeenItemsInfo().subscribe((r: Array<any>) => {
        this.lastSeenItems = r;
      });
      this.productsService.ctrlLastSeenItems(this.productInfo.product_id);
    });
  }

  calculateNewPrice(productId: number, optionId: any, parentOptionId: any, optionImages: Array<any>) {
    this.loading.show();
    this.productInfo.options
      .find((option: any) => option.option_id == parentOptionId)
      .values.forEach((value: any) => {
        value.isSelect = false;
        value.is_default = 0;
        if (optionId == value.product_option_value_id) value.isSelect = true;
      });
    this.getCurrentProductOptions();
    let Options = "";
    this.productOptions.forEach((r) => {
      Options += r.id + ",";
    });
    this.productsService.calculateNewPrice(productId, Options).then((r) => {
      this.loading.complete();
      this.productInfo.calc_price = r.data[0].calc_price;
      this.productInfo.quantity = r.data[0].stock_status;
    });
    if (optionImages.length) {
      this.productInfo.images = [];
      setTimeout(() => {
        this.productInfo.images = optionImages;
      }, 10);
    }
  }

  addItemToBasket(product: any) {
    this.loading.show();
    if (this.productOptions.length) {
      this.shopCartService
        .addBasket(
          {
            product_id: product.product_id,
            image_url: product.imageurl,
            image: product.image,
            name: product.name,
            price: product.price,
            calc_price: product.calc_price,
          },
          1,
          this.productOptions
        )
        .then((r) => {
          this.loading.complete();
          this.toastr.success("محصول مورد نظر با موفقیت به سبد خرید اضافه شد", "عملیات موفق");
          if (r) this.shopCartService.getBasket();
        });
    } else {
      this.shopCartService
        .addBasket(
          {
            product_id: product.product_id,
            image_url: product.imageurl,
            image: product.image,
            name: product.name,
            price: product.price,
            calc_price: product.calc_price,
          },
          1
        )
        .then((r) => {
          this.loading.complete();
          this.toastr.success("محصول مورد نظر با موفقیت به سبد خرید اضافه شد", "عملیات موفق");
          if (r) this.shopCartService.getBasket();
        });
    }
  }

  addComment(product_id: number) {
    this.loading.show();
    this.productsService.addComment(product_id, this.form.value).then((r) => {
      this.toastr.success("پیغام شما با موفقیت ثبت شد پس از بررسی به محصول اضافه خواهد شد", "عملیات موفق");
      this.loading.complete();
    });
  }

  getCurrentProductOptions() {
    this.productOptions = [];
    this.productInfo.options.forEach((option: any) => {
      option.values.forEach((value: any) => {
        if (value.isSelect || value.is_default)
          this.productOptions.push({
            name: option.option_description.name,
            value: value.value_description.name,
            id: value.product_option_value_id,
          });
      });
    });
  }

  ctrlItemInWishList(productid: number, isInWishList: boolean) {
    if (isInWishList) {
      this.middlewareService.deleteMiddleware(`public/wishproduct/remove/${productid}`).subscribe((r) => {
        this.productInfo.is_whishlist = 0;
        this.toastr.success("محصول مورد نظراز لیست علاقمندی های شما حذف شد", "عملیات موفق");
      });
    } else {
      this.middlewareService.postMiddleware("public/wishproduct/add", { productid }).subscribe((r) => {
        this.productInfo.is_whishlist = 1;
        this.toastr.success("محصول مورد نظر به لیست علاقمندی های شما افزوده شد", "عملیات موفق");
      });
    }
  }

  share(linkInput: any) {
    linkInput.value = window.location.href;
    linkInput.select();
    document.execCommand("copy");
    linkInput.setSelectionRange(0, 0);
    this.toastr.success("لینک محصول کپی شد", "موفق");
    console.warn("Token copied to Clipboard !!");
  }

  login() {
    this.router.navigate(["/auth/login"], { queryParams: { redirect: window.location.pathname }, replaceUrl: true });
  }

  getImageUrl(x: string) {
    return environment.CDN + `/products/${x}`;
  }

  ctrlItemNotification(productid: number, isNoticeable: boolean) {
    if (isNoticeable) {
      this.middlewareService.deleteMiddleware(`public/noticeproduct/remove/${productid}`).subscribe((r) => {
        this.productInfo.is_noticeable = 0;
        this.toastr.success("محصول مورد نظراز لیست علاقمندی های شما حذف شد", "عملیات موفق");
      });
    } else {
      this.middlewareService.postMiddleware("public/noticeproduct/add", { productid }).subscribe((r) => {
        this.productInfo.is_noticeable = 1;
        this.toastr.success("محصول مورد نظر به لیست علاقمندی های شما افزوده شد", "عملیات موفق");
      });
    }
  }
}
