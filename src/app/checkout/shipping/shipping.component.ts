import { Component, OnInit, OnDestroy } from "@angular/core";
import { CheckoutService } from "@app/@shared/services/checkout.service";
import { NgxSmartModalService, NgxSmartModalComponent } from "ngx-smart-modal";
import * as moment from "jalali-moment";
import { DialogSelectComponent } from "@app/@shared/components/dialog-select/dialog-select.component";
import { CtrlModalService } from "@app/@shared/modal/ctrl-modal.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "@app/@shared/services/loading.service";
import { Router } from "@angular/router";
import { Subscription, Observable, of, forkJoin } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { IDatePickerConfig } from "@app/@shared/datePicker";
import { FormErrosCtrlService } from '@app/@shared/services/form-erros-ctrl.service';
import { ShopCartService } from '@app/@shared/services/shop-cart.service';
import { ConfirmationComponent } from '@app/@shared/components/confirmation/confirmation.component';

@Component({
  selector: "app-shipping",
  templateUrl: "./shipping.component.html",
  styleUrls: ["./shipping.component.scss"],
})
export class ShippingComponent implements OnInit, OnDestroy {
  datePickerConfig: IDatePickerConfig;
  private subscriptions = new Subscription();
  order: any;
  myAddress: Array<any>;
  form: FormGroup;
  formErrors: any = {};
  selectedHour: string;
  shippingZoneId: number;

  constructor(
    private checkoutService: CheckoutService,
    private ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private ctrlModalService: CtrlModalService,
    private loading: LoadingService,
    private router: Router,
    private toastr: ToastrService,
    private formErrorService: FormErrosCtrlService,
    private shopCartService: ShopCartService
  ) {
    this.order = this.checkoutService.getOrder();
    this.form = this.formBuilder.group({
      date: [this.order.data || null, Validators.required],
      hour_id: [this.order.hour_id || null, Validators.required],
      address_id: [this.order.address_id || null, Validators.required],
      comment: this.order.comment || null,
    });
    Object.entries(this.form.controls).forEach(ctrl => {
			const ctrlName = ctrl[0];
			ctrl[1].valueChanges.subscribe(data => {
				this.formErrors[ctrlName] = this.formErrorService.validateForm(ctrl[1]);
			});
    });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.checkoutService.getSubmitAction().subscribe((r) => {
        this.next();
      })
    );
  }

  getHoursOfDelivery(e?: any) {
    if (this.form.value["date"]) {
      this.loading.show();
      this.checkoutService.getDeliveryTime(this.form.value["date"]).then((r) => {
        this.loading.complete();
        if (r.data && r.data.length) {
          const obj: Object = {
            desc: "زمان تحویل مرسوله را انتخاب کنید",
            listItems: r.data,
            header: "زمان تحویل",
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
              this.selectedHour = x.title;
              this.form.controls["hour_id"].patchValue(x.id);
            });
        }
        else {
          this.toastr.error('در تاریخ انتخابی زمانی برای تحویل وجود ندارد تاریخ خود را تغییر دهید','خطا')
        }
      });
    }
    else {
      this.toastr.error('ابتدا تاریخ تحویل را بدرستی وارد نمایید', 'خطا')
    }
  }

  onChangeDate() {
    this.getHoursOfDelivery();
  }

  next() {
		this.formErrorService.markFormGroupTouched(this.form);
    if (this.form.valid) {
      this.checkShippingItems().subscribe(r => {
        if (r) {
          this.checkoutService.saveOrder(this.form.value);
          this.router.navigateByUrl("/checkout/accessory");
        }
      })
    } else {
      this.toastr.error("اطلاعات ادرس و زمان تحویل را بدرستی وارد کنید", "خطا")
      Object.entries(this.form.controls).forEach(ctrl => {
        const ctrlName = ctrl[0];
        this.formErrors[ctrlName] = this.formErrorService.validateForm(ctrl[1], true);
      });
    }
  }

  addressHasSet(addressId: number) {
    this.checkoutService.saveOrder({address_id: addressId})
    this.checkoutService.getDeliveryDate().then((r) => {
      this.datePickerConfig = {
        drops: "down",
        format: "YYYY/MM/DD",
        min: moment(r.data),
        max: moment(r.data).add(2, "months"),
      };
    });
    this.form.controls['date'].patchValue(null);
    this.form.controls['hour_id'].patchValue(null);
    this.selectedHour = null;
    this.checkoutService.factorApiCall();
  }

  checkShippingItems(): Observable<boolean> {
    const shopCartItems: Array<any> = JSON.parse(localStorage.getItem('shopCart'));
    let cantSendItems = shopCartItems.filter(item => !item.product.cities.some((x: any) => x.zone_id == this.shippingZoneId));
    let cantSendItemsNameString = cantSendItems.map(item => item.product.name).join();
    if (!cantSendItems.length) return of(true);
    return Observable.create((observer: any) => {
      const obj: Object = {
        dialogDesc: `امکان ارسال محصولات ${cantSendItemsNameString} به ادرس انتخابی وجود ندارد.
        آیا تمایل به ارسال باقی محصولات دارید؟`
      };
      const dialog = this.ngxSmartModalService.create(
        'confirmation',
        ConfirmationComponent,
        this.ctrlModalService.centerOption()
      );
      dialog
        .setData(obj)
        .open()
        .onClose.subscribe((modal: NgxSmartModalComponent) => {
          const data = modal.getData();
          if (data) {
            let deleteShopCartsApi = cantSendItems.map(r => this.shopCartService.deleteBasket(r.id));
            forkJoin(deleteShopCartsApi).subscribe(r => {
              observer.next(true);
              observer.complete();
            })
          }
          else {
            observer.next(false);
            observer.complete();
          }
        });
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
