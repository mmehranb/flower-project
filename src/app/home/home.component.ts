import { Component, OnInit } from "@angular/core";
import { SwiperConfigInterface } from "ngx-swiper-wrapper";
import { HomeService } from "./home.service";
import { ProductsService } from "@app/@shared/services/products.service";
import { ActivatedRoute } from "@angular/router";
import { StaticDataService } from "@app/@shared/services/static-data.service";
import { environment } from "@env/environment";
import { forkJoin } from "rxjs";
import { LoadingService } from "@app/@shared/services/loading.service";
import * as moment from "jalali-moment";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  deviceWidth: number;
  topSliderItems: Array<any>;
  fastSendingProducts: Array<any>;
  newestProducts: Array<any>;
  categorySliderItems: Array<any> = [];
  banerItems: any = {
    p1: [],
    p2: [],
    p3: [],
    p4: [],
    p5: [],
  };
  categoryProductItems: Array<any>;
  categoryIndex = 0;
  timeStampToEndLeague: number;

  public benisConfig: SwiperConfigInterface = {
    slidesPerView: 1,
    allowTouchMove: true,
    loop: true,
    spaceBetween: 15,
    autoplay: {
      delay: 4000,
    },
    pagination: {
      el: ".pagination",
      clickable: true,
      hideOnClick: false,
    },
  };
  public deliveryConfig: SwiperConfigInterface = {
    slidesPerView: 3.5,
    spaceBetween: 15,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  };
  public categorySliderConfig: SwiperConfigInterface = {
    slidesPerView: 1,
    pagination: {
      el: ".pagination-category",
      clickable: true,
    },
    navigation: {
      nextEl: ".pagination-button-next",
      prevEl: ".pagination-button-prev",
    },
  };

  constructor(
    private homeSrvice: HomeService,
    private loading: LoadingService,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private staticDataService: StaticDataService
  ) {
    this.homeSrvice.getSliderItems().subscribe((r) => {
      this.topSliderItems = r.map((item: any) => {
        return {
          ...item,
          image: this.getImageUrl("slides/" + item.image),
          responsive_image: this.getImageUrl("slides/" + item.image_responsive),
        };
      });
    });
    this.loading.show();
    let _fastSendingProducts = this.productsService.getProducts(this.route.snapshot, { is_fastsending: "true" });
    let _newestProducts = this.productsService.getProducts(this.route.snapshot, { per_page: 8, is_new: 1 });
    forkJoin([_fastSendingProducts, _newestProducts]).subscribe((r) => {
      this.loading.complete();
      this.fastSendingProducts = r[0].data;
      this.newestProducts = r[1].data;
    });
    this.staticDataService.getCategories().subscribe((r) => {
      r.forEach((item: any) => {
        if (item.children) {
          item.children.forEach((child: any) => {
            if (child.isspecial) {
              this.categorySliderItems.push({
                ...child,
                image2url: child.image2url ? child.image2url.replace(" ", "%20") : "",
              });
            }
          });
        }
        if (item.isspecial) {
          this.categorySliderItems.push({
            ...item,
            image2url: item.image2url ? item.image2url.replace(" ", "%20") : "",
          });
        }
      });
      this.categorySliderItems = this.categorySliderItems.sort((a, b) => a.sort_order - b.sort_order);
      this.categorySlideChange(0);
    });
    this.staticDataService.getBanners().subscribe((r) => {
      const banners = r;
      banners.forEach((element: any) => {
        element.image = this.getImageUrl("banners/" + element.image);
        this.banerItems["p" + element.place_id].push(element);
      });
    });
    let times = [
      moment().hour(0).minute(0).second(0).format(),
      moment().hour(3).minute(0).second(0).format(),
      moment().hour(6).minute(0).second(0).format(),
      moment().hour(9).minute(0).second(0).format(),
      moment().hour(12).minute(0).second(0).format(),
      moment().hour(15).minute(0).second(0).format(),
      moment().hour(18).minute(0).second(0).format(),
      moment().hour(21).minute(0).second(0).format(),
      moment().hour(24).minute(0).second(0).format(),
    ];
    for (let r of times) {
      if (moment().diff(moment(r)) < 0) {
        this.timeStampToEndLeague = moment(r).valueOf();
        break;
      }
    }
  }

  ngOnInit() {
    this.deviceWidth = window.innerWidth;
  }

  addQWish() {}

  public categorySlideChange(e: any) {
    this.categoryIndex = e;
    this.productsService
      .getProducts(this.route.snapshot, { per_page: 4, special: 1, categories_id: this.categorySliderItems[e].id })
      .subscribe((r) => {
        this.categoryProductItems = r.data;
      });
  }

  getImageUrl(x: string) {
    return environment.CDN + `/${x}`;
  }
}
