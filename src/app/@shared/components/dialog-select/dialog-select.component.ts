import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from "@angular/core";
import { NgxSmartModalService } from "ngx-smart-modal";

@Component({
  selector: "app-dialog-select",
  templateUrl: "./dialog-select.html",
  styleUrls: ["./dialog-select.scss"],
})
export class DialogSelectComponent implements OnInit {
  @Input() desc: any;
  @Input() listItems: [] = [];
  @Input() defaultValue: any;
  @Output() valueSelect = new EventEmitter<any>();
  dialogData: any = "";

  constructor(private ngxSmartModalService: NgxSmartModalService, private el: ElementRef) {}

  ngOnInit() {
    this.dialogData = this.ngxSmartModalService.getModalData("dialogSelect");
  }

  selectItem(item: any) {
    this.ngxSmartModalService.setModalData(item, "dialogSelect", true);
    this.ngxSmartModalService.close("dialogSelect");
  }
}
