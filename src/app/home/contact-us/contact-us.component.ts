import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HomeService } from '../home.service';

@Component({
  selector: "app-contact-us",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.scss"],
})
export class ContactUsComponent implements OnInit {
  form: FormGroup;
  formErrors: any = {}

  constructor(private formBuilder: FormBuilder, private homeService: HomeService) {
    this.buildForm();
  }

  ngOnInit(): void {}

  buildForm() {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      subject: [null, Validators.required],
      text: [null, Validators.required],
      tell: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]]
    })
  }

  submit() {
    if (this.form.valid) {
      this.homeService.postContactUsReq(this.form.value).then(r => {
        this.form.markAsPristine();
      })
    }
  }
}
