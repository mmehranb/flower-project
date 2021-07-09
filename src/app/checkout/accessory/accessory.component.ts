import { Component, OnDestroy, OnInit } from "@angular/core";
import { CheckoutService } from "@app/@shared/services/checkout.service";
import { ProductsService } from "@app/@shared/services/products.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { LoadingService } from "@app/@shared/services/loading.service";
import { DialogSelectComponent } from "@app/@shared/components/dialog-select/dialog-select.component";
import { NgxSmartModalService, NgxSmartModalComponent } from "ngx-smart-modal";
import { CtrlModalService } from "@app/@shared/modal/ctrl-modal.service";
import { StaticDataService } from '@app/@shared/services/static-data.service';

@Component({
  selector: "app-accessory",
  templateUrl: "./accessory.component.html",
  styleUrls: ["./accessory.component.scss"],
})
export class AccessoryComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  order: any;
  accesoories: Array<any>;

  constructor(
    private checkoutService: CheckoutService,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private loading: LoadingService,
    private ngxSmartModalService: NgxSmartModalService,
    private ctrlModalService: CtrlModalService,
    private staticDataService: StaticDataService
  ) {
    this.order = this.checkoutService.getOrder();
    this.checkoutService.factorApiCall();
    this.subscriptions.add(
      this.checkoutService.getSubmitAction().subscribe((r) => {
        this.next();
      })
    );
    this.getproducts();
  }

  ngOnInit(): void {}

  next() {
    this.router.navigateByUrl("/checkout/payment");
  }

  afterProductAdd() {
    this.checkoutService.factorApiCall();
  }

  getproducts(param?: any) {
    const newParam = {
      ...param,
      is_accessory: 1
    }
    this.loading.show();
    this.productsService.getProducts(this.route.snapshot, newParam).subscribe((r) => {
      this.loading.complete();
      this.accesoories = r.data;
    });
  }

  filter() {
    this.staticDataService.getEvents().subscribe(r => {
      const obj: Object = {
        desc: "نوع مناسبت خود را انتخاب کنید",
        listItems: r.map((x: any) => {return {...x, title: x.name}}),
        header: "نوع مناسبت",
      };
      const dialog = this.ngxSmartModalService.create(
        "dialogSelect",
        DialogSelectComponent,
        this.ctrlModalService.centerOption()
      );
      dialog
        .setData(obj)
        .open()
        .onClose.subscribe((modal: NgxSmartModalComponent) => {
          const x = modal.getData();
          this.getproducts({events_id: x.id})
        });
    })
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
