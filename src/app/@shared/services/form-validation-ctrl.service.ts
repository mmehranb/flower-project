import { Injectable } from "@angular/core";
import { ValidatorFn, FormControl, Validators } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class FormValidationCtrlService {
  //validation type objects
  public FA_MODEL = {
    pattern: /^[\u0600-\u06FF\s]+$/,
    msg: "از حروف فارسی استفاده کنید",
  };
  public EN_MODEL = {
    pattern: /^[a-zA-Z]+$/,
    msg: "از حروف انگلیسی استفاده کنید",
  };
  public PASSPORT_MODEL = {
    pattern: /^[a-zA-Z][0-9]{7,9}$/,
    msg: "شماره پاسپورت شامل عدد و یک حرف انگلیسی است",
  };
  public NATIONALCODE_MODEL = {
    pattern: /^\d{10}$/,
    msg: "کد ملی نامعتبر است",
  };
  public NUMBER_MODEL = {
    pattern: /^[0-9]+$/,
    msg: "از اعداد انگلیسی استقاده کنید",
  };
  public IBAN_MODEL = {
    pattern: /^[0-9۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩]{24}$/,
    msg: "برای شماره شبا از 24 عدد استفاده کنید",
  };
  /**/
  constructor() {}

  customPatternValid(config: any): ValidatorFn {
    return (control: FormControl) => {
      let urlRegEx: RegExp = config.pattern;

      //another exception for national id validation
      if (control.value && config == this.NATIONALCODE_MODEL) {
        let check = parseInt(control.value[9]),
          sum = 0;
        for (let i = 0; i < 9; ++i) sum += parseInt(control.value[i]) * (10 - i);
        sum %= 11;

        if (!((sum < 2 && check == sum) || (sum >= 2 && check + sum == 11))) {
          return {
            invalidMsg: config.msg,
          };
        } else {
          return null;
        }
      }

      if (control.value && !urlRegEx.test(control.value)) {
        return {
          invalidMsg: config.msg,
        };
      } else {
        return null;
      }
    };
  }

  customDiseaseValid(): ValidatorFn {
    return (control: FormControl) => {
      let checkValid = control.valid;
      if (control.valid) {
        checkValid = Object.values(control.value).some((val) => !val == false);
      }
      if (checkValid) return null;
      else
        return {
          invalidMsg: "انتخاب یکی از موارد الزامی است",
        };
    };
  }

  customLicensePlateNumberValid(): ValidatorFn {
    return (control: FormControl) => {
      if (control.value) {
        if (control.value.length == 9) return null;
        else
          return {
            invalidMsg: "شماره پلاک را بدرستی وارد کنید",
          };
      }
    };
  }
}
