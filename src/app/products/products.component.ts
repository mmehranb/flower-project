import { Component, OnInit, ChangeDetectorRef } from "@angular/core";

import { trigger, transition, style, animate, query, stagger, animateChild } from "@angular/animations";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { ProductsService } from "@app/@shared/services/products.service";
import { LoadingService } from "@app/@shared/services/loading.service";
import { Title, Meta } from "@angular/platform-browser";
import { map } from "rxjs/operators";
import { NgxSmartModalComponent, NgxSmartModalService } from "ngx-smart-modal";
import { ProductsFilterComponent } from "./products-filter/products-filter.component";
import { CtrlModalService } from "@app/@shared/modal/ctrl-modal.service";
import { SeoService } from "@app/@shared/services/seo.service";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
  animations: [
    trigger("list", [transition(":enter", [query("@items", stagger(150, animateChild()))])]),
    trigger("items", [
      transition(":enter", [
        style({ transform: "scale(0.5)", opacity: 0 }), // initial
        animate("250ms cubic-bezier(.8, -0.6, 0.2, 1.5)", style({ transform: "scale(1)", opacity: 1 })), // final
      ]),
    ]),
  ],
})
export class ProductsComponent implements OnInit {
  paginationConfig: any;
  currentPage: number;
  actionFilter: Object = {
    order: 1,
  };
  productsItem: Array<any>;
  productsConfig: any;
  queryParams: any;
  headTitle: string = "محصولات";
  tagTitle: string;
  sortbyFilter: number = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private loading: LoadingService,
    private ngxSmartModalService: NgxSmartModalService,
    private ctrlModalService: CtrlModalService,
    private title: Title,
    private meta: Meta,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.seoService.createLinkForCanonicalURL();
    if (this.route.snapshot.queryParams && this.route.snapshot.queryParams.sortby) {
      this.sortbyFilter = this.route.snapshot.queryParams.sortby;
    }
    this.route.params.subscribe((val) => {
      this.queryParams = this.route.snapshot.queryParams;
      this.productsConfig = this.route.snapshot.data["products"];
      this.currentPage = this.productsConfig.current_page;
      this.productsItem = this.productsConfig.data;
      switch (this.route.snapshot.data["title"]) {
        case "products": {
          this.headTitle = val.category2 || val.category1 ? `${val.category2 || val.category1}` : "محصولات";
          this.tagTitle = `${this.productsConfig.name || "محصولات"}|خرید اینترنتی از بنیس فلاور`;
          if (this.queryParams["is_fastsending"] == "true") {
            this.tagTitle = `محصولات روز|خرید اینترنتی از بنیس فلاور`;
            this.headTitle = "محصولات روز";
          }
          if (this.queryParams["is_new"] == "1") {
            this.tagTitle = `جدیدترین محصولات|خرید اینترنتی از بنیس فلاور`;
            this.headTitle = "جدیدترین محصولات";
          }
          break;
        }
        case "tags": {
          this.headTitle = val.tagName ? `${val.tagName}` : "محصولات";
          this.tagTitle = `${val.tagName || "محصولات"}|خرید اینترنتی از بنیس فلاور`;
          break;
        }
        case "events": {
          this.headTitle = val.eventName ? `${val.eventName}` : "محصولات";
          this.tagTitle = `${this.productsConfig.name || "محصولات"}|خرید اینترنتی از بنیس فلاور`;
          break;
        }
        case "search": {
          this.headTitle = this.queryParams["name"] ? `نتایج جستجو عبارت ${this.queryParams["name"]}` : "محصولات";
          this.tagTitle = `${this.queryParams["name"] || "محصولات"}|خرید اینترنتی از بنیس فلاور`;
          break;
        }
      }
      if (this.productsConfig.meta_tag_description) {
        this.meta.updateTag({ name: "description", content: this.productsConfig.meta_tag_description });
        this.meta.updateTag({ name: "twitter:description", content: this.productsConfig.meta_tag_description });
        this.meta.updateTag({ property: "og:description", content: this.productsConfig.meta_tag_description });
      }
      if (this.productsConfig.meta_tag_title) {
        this.title.setTitle(this.productsConfig.meta_tag_title);
        this.meta.updateTag({ property: "og:title", content: this.productsConfig.meta_tag_title });
        this.meta.updateTag({ property: "twitter:title", content: this.productsConfig.meta_tag_title });
      }
      if (this.productsConfig.meta_tag_keywords) {
        this.meta.updateTag({ name: "keywords", content: this.productsConfig.meta_tag_keywords });
      }
    });
    this.route.queryParams.subscribe((params) => {
      if (params != this.queryParams) {
        this.queryParams = params;
        this.getProducts();
        switch (this.route.snapshot.data["title"]) {
          case "products": {
            this.headTitle =
              this.route.snapshot.params.category2 || this.route.snapshot.params.category1
                ? `${this.route.snapshot.params.category2 || this.route.snapshot.params.category1}`
                : "محصولات";
            this.title.setTitle(
              `${
                this.route.snapshot.params.category2 || this.route.snapshot.params.category1 || "محصولات"
              }|خرید اینترنتی از بنیس فلاور`
            );
            if (this.queryParams["is_fastsending"] == "true") {
              this.title.setTitle(`محصولات روز|خرید اینترنتی از بنیس فلاور`);
              this.headTitle = "محصولات روز";
            }
            if (this.queryParams["is_new"] == "true") {
              this.title.setTitle(`جدیدترین محصولات|خرید اینترنتی از بنیس فلاور`);
              this.headTitle = "جدیدترین محصولات";
            }
            break;
          }
          case "tags": {
            this.headTitle = this.route.snapshot.params.tagName ? `${this.route.snapshot.params.tagName}` : "محصولات";
            this.title.setTitle(`${this.route.snapshot.params.tagName || "محصولات"}|خرید اینترنتی از بنیس فلاور`);
            break;
          }
          case "events": {
            this.headTitle = this.route.snapshot.params.eventName
              ? `مناسبت ${this.route.snapshot.params.eventName}`
              : "محصولات";
            this.title.setTitle(`${this.route.snapshot.params.eventName || "محصولات"}|خرید اینترنتی از بنیس فلاور`);
            break;
          }
          case "search": {
            this.headTitle = params["name"] ? `نتایج جستجو عبارت ${params["name"]}` : "محصولات";
            this.title.setTitle(`${params["name"] || "محصولات"}|خرید اینترنتی از بنیس فلاور`);
            break;
          }
        }
      }
    });
  }

  getProducts() {
    this.loading.show();
    this.productsService.getProducts(this.route.snapshot).subscribe((r) => {
      this.loading.complete();
      this.productsConfig = r;
      this.currentPage = this.productsConfig.current_page;
      this.productsItem = this.productsConfig.data;
    });
  }

  initFilter(e: any, type: string) {
    if (type == "sortby") this.sortbyFilter = e.sortby;
    let newParam: object = {};
    Object.entries(this.queryParams).forEach((param: any) => {
      if (!param[0].includes(type)) newParam[param[0]] = param[1];
    });
    if (!e.page) {
      e.page = 1;
    }
    if (e.hasOwnProperty("sortby") && e.sortby == null) this.queryParams = newParam;
    else {
      this.queryParams = { ...newParam, ...e };
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.queryParams,
      queryParamsHandling: "", // remove to replace all query params by provided
    });
  }

  modalFilter() {
    const obj: Object = {
      defaultValue: this.queryParams,
    };
    const dialog = this.ngxSmartModalService.create(
      "proFilter",
      ProductsFilterComponent,
      this.ctrlModalService.centerOption()
    );
    dialog
      .setData(obj)
      .open()
      .onClose.subscribe((modal: NgxSmartModalComponent) => {
        const x = modal.getData();
        this.initFilter(x["params"], x["type"]);
      });
  }
}
