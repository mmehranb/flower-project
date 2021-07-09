import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ProfileService } from "@app/@shared/services/profile.service";
import { LoadingService } from "@app/@shared/services/loading.service";
import { AuthenticationService } from "@app/auth";
import { delayWhen } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit {
  form: FormGroup;
  formErrors: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private loading: LoadingService,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  submit() {
    this.loading.show();
    this.profileService.editUserInfo(this.form.value).then(
      (r) => {
        this.loading.complete();
        this.authenticationService.fetchUserInfo();
      },
      (error: any) => {
        this.toastr.error("اطلاعات کاربر را به درستی وارد کنید", "خطا");
      }
    );
  }

  createForm() {
    this.authenticationService.getUserInfo().subscribe((r) => {
      this.form = this.formBuilder.group({
        firstname: r.data.firstname,
        lastname: r.data.lastname,
        email: r.data.email
      });
    });
  }
}
