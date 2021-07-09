import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-join-us',
  templateUrl: './join-us.component.html',
  styleUrls: ['./join-us.component.scss']
})
export class JoinUsComponent implements OnInit {
  formErrors: any = {}
  form: FormGroup;


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
