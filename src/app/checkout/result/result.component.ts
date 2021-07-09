import { Component, OnInit } from "@angular/core";
import { Route } from "@angular/compiler/src/core";
import { ActivatedRoute } from "@angular/router";
import { CheckoutService } from "@app/@shared/services/checkout.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrosCtrlService } from "@app/@shared/services/form-erros-ctrl.service";
import * as moment from 'jalali-moment';
import { ProfileService } from '@app/@shared/services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { StaticDataService } from '@app/@shared/services/static-data.service';
import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';
import { DialogSelectComponent } from '@app/@shared/components/dialog-select/dialog-select.component';
import { CtrlModalService } from '@app/@shared/modal/ctrl-modal.service';

@Component({
  selector: "app-result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.scss"],
})
export class ResultComponent implements OnInit {
  orderDetail: any;
  form: FormGroup;
  formErrors: any = {};
  datePickerConfig = {
    drops: "down",
    format: "YYYY/MM/DD",
  };
  selectedEvent: string;

  constructor(
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
    private formBuilder: FormBuilder,
    private formErrorService: FormErrosCtrlService,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private staticDataService: StaticDataService,
    private ngxSmartModalService: NgxSmartModalService,
    private ctrlModalService: CtrlModalService
  ) {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      eventid: [null, Validators.required],
      date: [null, Validators.required],
      smsontime: 1,
    });
    Object.entries(this.form.controls).forEach((ctrl) => {
      const ctrlName = ctrl[0];
      ctrl[1].valueChanges.subscribe((data) => {
        this.formErrors[ctrlName] = this.formErrorService.validateForm(ctrl[1]);
      });
    });
    this.route.params.subscribe((val: any) => {
      this.checkoutService.getOrderDetail(val["orderId"]).then((r) => {
        this.orderDetail = r.data[0];
      });
    });
  }

  ngOnInit(): void {}

  showEventItems() {
    this.staticDataService.getEvents().subscribe((r: any) => {
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
          this.selectedEvent = x.title;
          this.form.controls["eventid"].patchValue(x.id);
        });
    })
  }

  submit() {
		this.formErrorService.markFormGroupTouched(this.form);
    if (this.form.valid) {
      const formValue = this.form.value;
      const data = {
        eventid: formValue.eventid,
        name: formValue.name,
        event_day: moment(formValue.date, 'JYYYY/JMM/JDD').date(),
        event_month: moment(formValue.date, 'JYYYY/JMM/JDD').month() + 1,
        smsontime: 1
      }
      this.profileService.addReminder(data).then(r => {
        this.toastr.success("تاریخ مورد نظر با موفقیت به تقویم شخصی اضافه شد", "عملیات موفق");
      })
    }
    else {
      Object.entries(this.form.controls).forEach(ctrl => {
        const ctrlName = ctrl[0];
        this.formErrors[ctrlName] = this.formErrorService.validateForm(ctrl[1], true);
      });
    }
  }
}
