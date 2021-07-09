import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NgxSmartModalService, NgxSmartModalComponent } from "ngx-smart-modal";
import { AddressDetailComponent } from "./address-detail/address-detail.component";
import { CtrlModalService } from "@app/@shared/modal/ctrl-modal.service";
import { FormGroup } from "@angular/forms";
import { ProfileService } from "@app/@shared/services/profile.service";

@Component({
  selector: "address-card",
  templateUrl: "./address-card.component.html",
  styleUrls: ["./address-card.component.scss"],
})
export class AddressCardComponent implements OnInit {
  @Input() form?: FormGroup;
  @Input() formCtrlName?: string;
  @Input() useInForm: boolean = false;
  @Input() activeItem: boolean;
  @Output() onSelectAddress = new EventEmitter<any>();
  myAddress: Array<any>;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private ctrlModalService: CtrlModalService,
    private profileService: ProfileService
  ) {
    this.getUserAddress()
  }

  ngOnInit(): void {
    if (this.form) {
      this.form.controls[this.formCtrlName].valueChanges.subscribe(data => {
        this.onSelectAddress.emit({zone: this.myAddress.find(r => r.address_id == data).zone_id, addressId: data})
      });
    }
  }

  getUserAddress() {
    this.profileService.getUserAddresses().then((r) => {
      this.myAddress = r.data;
      if (this.useInForm) {
        if (this.myAddress.length) {
          this.myAddress.forEach((element: any) => {
            if (element.isdefault)
              this.form.controls[this.formCtrlName].patchValue(element.address_id)
          });
          if (!this.form.value[this.formCtrlName]) {
            this.form.controls[this.formCtrlName].patchValue(r.data[0].address_id)
          }
          const x = this.myAddress.find(r => r.address_id == this.form.value[this.formCtrlName]);
          this.onSelectAddress.emit({zone: (x && x.zone_id), addressId: this.form.value[this.formCtrlName]})
        }
        else {
          this.onSelectAddress.emit({zone: null, addressId: null})
        }
      }
    });

  }

  ctrlAddressCard(addressInfo?: any) {
    const obj: object = {
      addressInfo: addressInfo || null,
    };
    const dialog = this.ngxSmartModalService.create(
      "ctrlAddress",
      AddressDetailComponent,
      this.ctrlModalService.centerOption()
    );
    dialog
      .setData(obj)
      .open()
      .onClose.subscribe((modal: NgxSmartModalComponent) => {
        this.getUserAddress()
      });
  }

  selectAddress(e: any) {
    this.form.controls[this.formCtrlName].patchValue(e);
  }

  deleteAddress(address_id: number) {
    this.profileService.deleteUserAddress(address_id).then(() => this.getUserAddress());
  }
}
