import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NgxSmartModalService } from "ngx-smart-modal";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingService } from "@app/@shared/services/loading.service";
import { AuthenticationService } from "../authentication.service";
import { finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { FormErrosCtrlService } from "@app/@shared/services/form-erros-ctrl.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "auth-form",
  templateUrl: "./auth-form.component.html",
  styleUrls: ["./auth-form.component.scss"],
})
export class AuthFormComponent implements OnInit {
  @Input() currentAction!: any;
  form: FormGroup;
  formErrors: any = {};
  username: FormControl;
  password: FormControl;
  firstname: FormControl;
  lastname: FormControl;
  email: FormControl;
  address: FormControl;
  telephone: FormControl;
  confirmcode: FormControl;
  newpassword: FormControl;
  company_name: FormControl;
  company_telephone: FormControl;
  company_nationalid: FormControl;

  constructor(
    private loading: LoadingService,
    private authenticationService: AuthenticationService,
    private ngxSmartModalService: NgxSmartModalService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public formErrorService: FormErrosCtrlService
  ) {
    this.username = new FormControl(null, Validators.required);
    this.password = new FormControl({ disabled: true, value: null }, Validators.required);
    this.firstname = new FormControl(null, Validators.required);
    this.lastname = new FormControl(null, Validators.required);
    this.email = new FormControl(null, Validators.required);
    this.telephone = new FormControl(null, Validators.required);
    this.confirmcode = new FormControl({ disabled: true, value: null }, Validators.required);
    this.newpassword = new FormControl({ disabled: true, value: null }, Validators.required);
    this.company_name = new FormControl(null, Validators.required);
    this.company_telephone = new FormControl(null, Validators.required);
    this.company_nationalid = new FormControl(null, Validators.required);
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({});
    switch (this.currentAction.name) {
      case "login":
        this.form.addControl("username", this.username);
        this.form.addControl("password", this.password);
        break;

      case "signup":
        this.form.addControl("firstname", this.firstname);
        this.form.addControl("lastname", this.lastname);
        this.form.addControl("password", this.password);
        this.form.addControl("telephone", this.telephone);
        break;

      case "forgot":
        this.form.addControl("username", this.username);
        this.form.addControl("confirmcode", this.confirmcode);
        this.form.addControl("newpassword", this.newpassword);
        break;
    }
    Object.entries(this.form.controls).forEach((ctrl) => {
      const ctrlName = ctrl[0];
      ctrl[1].valueChanges.subscribe((data) => {
        this.formErrors[ctrlName] = this.formErrorService.validateForm(ctrl[1]);
      });
    });
  }

  submit() {
    this.formErrorService.markFormGroupTouched(this.form);
    if (this.form.valid) {
      let apicall$ = new Observable();
      this.loading.show();
      switch (this.currentAction.name) {
        case "login":
          apicall$ = this.authenticationService.login(this.form.value);
          break;
        case "signup":
          apicall$ = this.authenticationService.register(this.form.value);
          break;
      }
      apicall$
        .pipe(
          finalize(() => {
            this.form.markAsPristine();
            this.loading.complete();
          })
        )
        .subscribe(
          () => {
            if (this.currentAction.name == "login") {
              if (this.currentAction.useInModal) {
                this.ngxSmartModalService.close("authenticate");
              } else {
                this.router.navigate([this.route.snapshot.queryParams.redirect || "/"], { replaceUrl: true });
              }
            } else {
              this.sendToGetCode();
            }
          },
          (error: any) => {
            if (this.currentAction.name == "signup") {
              this.toastr.error("لطفا اطلاعات ورودی برای ثبت نام را مجدد بررسی کنید", "خطا");
            }
            if (this.currentAction.name == "login") {
              this.toastr.error("لطفا کد ارسالی را بدرستی وارد نمایید", "خطا");
              this.router.navigateByUrl("/auth/login");
            }
          }
        );
    } else {
      Object.entries(this.form.controls).forEach((ctrl) => {
        const ctrlName = ctrl[0];
        this.formErrors[ctrlName] = this.formErrorService.validateForm(ctrl[1], true);
      });
    }
  }

  sendToGetCode() {
    if (this.form.valid) {
      this.authenticationService.giveVerifyCode(this.form.value).then(
        (r: any) => {
          this.form.controls["password"].enable();
          this.currentAction.name = "login";
        },
        (error) => {
          this.toastr.error("شماره وارد شده اشتباه است یا قبلا ثبت نام نکرده اید", "خطا");
        }
      );
    }
  }

  changeUserName() {
    this.form.controls["password"].disable();
  }

  ctrlCompanyDetail(e: any) {
    if (e) {
      this.form.addControl("company_name", this.company_name);
      this.form.addControl("company_nationalid", this.company_nationalid);
      this.form.addControl("company_telephone", this.company_telephone);
    }
    else {
      this.form.controls["company_name"].disable();
      this.form.controls["company_nationalid"].disable();
      this.form.controls["company_telephone"].disable();
    }
  }
}
