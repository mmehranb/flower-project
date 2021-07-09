import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { empty } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormErrosCtrlService {
  constructor() { }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  validateForm(formControlToValidate: any ,onSubmit: boolean = false) {
    let formErrors: any = {};
    let flagForScrollToFirstError = true;

    formErrors = {msg: '', scrollToItem: false};
    if (formControlToValidate.status == "INVALID") {
      if (onSubmit && flagForScrollToFirstError) {
        formErrors.scrollToItem = true;
        flagForScrollToFirstError = false;
      }
      
      switch(Object.keys(formControlToValidate.errors)[0]) {
        case 'required':
          formErrors.msg = 'وارد کردن این فیلد الزامی است';
          break;
        case 'maxlength':
          formErrors.msg = `تعداد حروف نمیتواند بیشتر از ${formControlToValidate.errors.maxlength.requiredLength} کارکتر باشد.`
          break;
        case 'email':
          formErrors.msg = `فرمت ایمیل را بدرستی وارد کنید`
          break;
        case 'minlength':
          formErrors.msg = `تعداد حروف نمیتواند کمتر از ${formControlToValidate.errors.minlength.requiredLength} کارکتر باشد.`
          break;
        case 'min':
          formErrors.msg = `حداقل مبلغ ورودی ${formControlToValidate.errors.min.min} تومان است`
          break;
        case 'max':
          formErrors.msg = `حداکثر مبلغ ورودی ${formControlToValidate.errors.max.max} تومان است`
          break;
        case 'invalidMsg':
          formErrors.msg = formControlToValidate.errors.invalidMsg;
          break;
        default:
          break;
      }
    }
    return formErrors;
  }
}
