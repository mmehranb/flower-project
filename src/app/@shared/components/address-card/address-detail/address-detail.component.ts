import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgxSmartModalService, NgxSmartModalComponent } from "ngx-smart-modal";
import { CheckoutService } from "@app/@shared/services/checkout.service";
import { ProfileService } from "@app/@shared/services/profile.service";
import { StaticDataService } from "@app/@shared/services/static-data.service";
import { LoadingService } from "@app/@shared/services/loading.service";
import { DialogSelectComponent } from "../../dialog-select/dialog-select.component";
import { CtrlModalService } from "@app/@shared/modal/ctrl-modal.service";
import { FormErrosCtrlService } from "@app/@shared/services/form-erros-ctrl.service";
import { tileLayer, latLng } from "leaflet";
import * as L from "leaflet";
import { FormValidationCtrlService } from "@app/@shared/services/form-validation-ctrl.service";

@Component({
  selector: "app-address-detail",
  templateUrl: "./address-detail.component.html",
  styleUrls: ["./address-detail.component.scss"],
})
export class AddressDetailComponent implements OnInit, AfterViewInit {
  private map: any;
  acceptedMap: boolean = false;
  centerMapLoc: any;

  form: FormGroup;
  dialogData: any;
  formErrors: any = {};
  statesItems: Array<any>;
  selectedCity: string;

  constructor(
    private fb: FormBuilder,
    private ngxSmartModalService: NgxSmartModalService,
    private profileService: ProfileService,
    private staticDataService: StaticDataService,
    private loading: LoadingService,
    private ctrlModalService: CtrlModalService,
    public formErrorService: FormErrosCtrlService,
    private validService: FormValidationCtrlService
  ) {
    this.dialogData = this.ngxSmartModalService.getModalData("ctrlAddress");
    this.staticDataService.getZoneBaseInfo().subscribe((r: any) => {
      this.statesItems = r.data.Zone.map((r: any) => {
        return { id: r.zone_id, title: r.name };
      });
    });
    this.creatForm(this.dialogData.addressInfo);
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (!this.acceptedMap) this.initMap();
  }

  initMap() {
    setTimeout(() => {
      let myIcon = L.icon({
        iconUrl: "assets/images/icons/map-marker.svg",
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
      });
      this.map = L.map("map", {
        layers: [
          tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }),
        ],
        zoom: 15,
        maxZoom: 18,
        center: this.centerMapLoc,
      });
      let marker = L.marker(this.centerMapLoc, { icon: myIcon }).addTo(this.map);
      this.map.on("click", function (e: any) {
        updateMarker(e.latlng.lat, e.latlng.lng);
      });

      var updateMarker = (lat: any, lng: any) => {
        this.centerMapLoc = [lat, lng];
        marker.setLatLng([lat, lng]).openPopup();
        return false;
      };
    }, 100);
  }

  pickMap() {
    this.form.controls["latitude"].patchValue(this.centerMapLoc[0]);
    this.form.controls["longitude"].patchValue(this.centerMapLoc[1]);
    this.acceptedMap = true;
  }

  creatForm(info: any) {
    this.form = this.fb.group({
      address_id: (info && info.address_id) || null,
      title: [(info && info.title) || null, Validators.required],
      firstname: [(info && info.firstname) || null, Validators.required],
      lastname: [(info && info.lastname) || null, Validators.required],
      telephone: [
        (info && info.telephone) || null,
        [
          Validators.required,
          this.validService.customPatternValid(this.validService.NUMBER_MODEL),
          Validators.maxLength(13),
        ],
      ],
      company: [(info && info.company) || null],
      address_1: [(info && info.address_1) || null, Validators.required],
      postcode: [(info && info.postcode) || null],
      plaque: [(info && info.plaque) || null, Validators.required],
      unit: [(info && info.plaque) || null, Validators.required],
      zone_id: [(info && info.zone_id) || null, Validators.required],
      isdefault: [(info && info.isdefault) || null],
      latitude: [(info && info.latitude) || null],
      longitude: [(info && info.longitude) || null],
    });
    Object.entries(this.form.controls).forEach((ctrl) => {
      const ctrlName = ctrl[0];
      ctrl[1].valueChanges.subscribe((data) => {
        this.formErrors[ctrlName] = this.formErrorService.validateForm(ctrl[1]);
      });
    });
    this.staticDataService.getZoneBaseInfo().subscribe((r) => {
      this.selectedCity = info && info.zone_id ? r.data.Zone.find((x: any) => x.zone_id == info.zone_id).name : null;
    });

    this.centerMapLoc = [(info && info.latitude) || 35.696749473422116, (info && info.longitude) || 51.39184573665261];
    this.acceptedMap = this.form.value["latitude"] && this.form.value["longitude"];
    this.ctrlPostCodeValidation();
  }

  ctrlPostCodeValidation() {
    const zoneId = this.form.value.zone_id;
    this.form.controls["postcode"].clearValidators();
    this.formErrors.postcode = "";
    if (zoneId && zoneId == 1538) {
      this.form.controls["postcode"].setValidators([
        this.validService.customPatternValid(this.validService.NUMBER_MODEL),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]);
    } else {
      this.form.controls["postcode"].setValidators([
        Validators.required,
        this.validService.customPatternValid(this.validService.NUMBER_MODEL),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]);
    }
    this.form.controls["postcode"].updateValueAndValidity();
  }

  submit() {
    this.formErrorService.markFormGroupTouched(this.form);
    if (this.form.valid) {
      if (this.dialogData.addressInfo && this.dialogData.addressInfo.address_id) {
        this.profileService
          .editUserAddresses(this.staticDataService.changObjNumberToEnglish(this.form.value))
          .then((r) => {
            this.ngxSmartModalService.close("ctrlAddress");
          });
      } else {
        this.profileService
          .addUserAddresses(this.staticDataService.changObjNumberToEnglish(this.form.value))
          .then((r) => {
            this.ngxSmartModalService.close("ctrlAddress");
          });
      }
    } else {
      Object.entries(this.form.controls).forEach((ctrl) => {
        const ctrlName = ctrl[0];
        this.formErrors[ctrlName] = this.formErrorService.validateForm(ctrl[1], true);
      });
    }
  }
  getZoneId() {
    this.loading.show();
    this.staticDataService.getZoneBaseInfo().subscribe((r: any) => {
      this.loading.complete();
      const obj: Object = {
        desc: "استان مقصد را انتخاب کنید",
        listItems: r.data.Zone.map((r: any) => {
          return { id: r.zone_id, title: r.name };
        }),
        header: "لیست استان ها",
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
          this.selectedCity = x.title;
          this.form.controls["zone_id"].patchValue(x.id);
        });
    });
  }
}
