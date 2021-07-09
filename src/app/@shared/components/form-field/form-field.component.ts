import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  AfterViewChecked,
} from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "form-field",
  templateUrl: "./form-field.component.html",
  styleUrls: ["./form-field.component.scss"],
})
export class FormFieldComponent implements OnInit, AfterViewChecked {
  @Input() form?: FormGroup;
  @Input() formCtrlName: String;
  @Input() label: string;
  @Input() fieldIcon: string;
  @Input() fieldClass?: string = "";
  @Input() field?: string = "input";
  @Input() fieldType?: string = "text";
  @Input() inputMode?: string = "text";
  @Input() fieldValueText: any = null;
  @Input() fieldDisabled?: boolean = false;
  @Input() options: Array<string> = [];
  @Input() readOnly: boolean = false;
  @Input() mask?: string;
  @Input() helpDesc?: string = "";
  @Input() handleValidation: any = "";
  @Input() haveClearValue: boolean = false;
  @Input() selectOptions: Array<any>;
  @Output() onClick = new EventEmitter<any>();
  @Output() onChange = new EventEmitter<any>();
  @Output() onKeyup = new EventEmitter<any>();

  inputFocus: boolean = false;
  fieldActivation: boolean = false;
  isDisabled: boolean = false;
  handleActiveClass: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.handleActiveClass = !!this.form.value[`${this.formCtrlName}`] || this.form.value[`${this.formCtrlName}`] === 0;
    this.form.get(`${this.formCtrlName}`).valueChanges.subscribe((data) => {
      if (this.field == "select" && this.options) this.handleActiveClass = true;
      else {
        this.handleActiveClass = !!data || data === 0;
      }
      if (this.selectOptions) {
        const field = this.selectOptions.find(
          (option) => option.value == this.form.getRawValue()[`${this.formCtrlName}`]
        );
        this.fieldValueText = field ? field.text : "";
      }
    });
    if (this.fieldClass.includes("disabled")) {
      this.isDisabled = true;
    }
    if (this.selectOptions) {
      const field = this.selectOptions.find(
        (option) => option.value == this.form.getRawValue()[`${this.formCtrlName}`]
      );
      this.fieldValueText = field ? field.text : "";
    }
  }

  ngAfterViewChecked() {
    if (this.handleValidation && this.handleValidation.scrollToItem) {
      this.handleValidation.scrollToItem = false;
      this.scrollToInValidItem();
    }
    // your code to update the model
    this.cdr.detectChanges();
  }

  emitOnClick(e: any) {
    this.onClick.emit();
  }

  emitOnChange(e: any) {
    if (this.selectOptions) {
      this.fieldValueText = this.selectOptions.find(
        (option) => option.value == this.form.getRawValue()[`${this.formCtrlName}`]
      ).text;
    }
    this.onChange.emit();
  }

  emitOnKeyup(e: any) {
    this.onKeyup.emit(e);
  }

  checkValidationStatus() {
    return this.handleValidation && this.handleValidation.msg && this.form.get(`${this.formCtrlName}`).touched;
  }

  textAreaAdjust(o: any) {
    o.style.height = "1px";
    if (o.scrollHeight <= 100) o.style.height = o.scrollHeight + "px";
    else o.style.height = 100 + "px";
  }

  scrollToInValidItem() {
    const headerOffset = 50;
    const bodyOffsetTop = document.querySelector("body").getBoundingClientRect().top;
    const element = document.querySelector(`.js-${this.formCtrlName}`);
    const elementPosition = element.getBoundingClientRect().top;
    if (element) {
      window.scrollTo({
        top: elementPosition - bodyOffsetTop - headerOffset,
        behavior: "smooth",
      });
    }
  }

  clearValue() {
    this.form.controls[`${this.formCtrlName}`].patchValue(null);
  }
}
