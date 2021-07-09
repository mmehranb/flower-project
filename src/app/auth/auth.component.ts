import { Component, OnInit } from "@angular/core";
import { NgxSmartModalService } from "ngx-smart-modal";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit {
  action: any;
  dialogData: any;

  constructor(private ngxSmartModalService: NgxSmartModalService, private route: ActivatedRoute) {
    this.findCurrentAction();
  }

  ngOnInit(): void {}

  findCurrentAction() {
    this.ngxSmartModalService.getOpenedModals().forEach((item) => {
      if (item.id == "authenticate") {
        this.dialogData = item.modal.getData();
        this.action = {
          useInModal: true,
          name: this.dialogData.action,
        };
        return;
      }
    });
    if (!this.action)
      this.route.data.subscribe((data) => {
        this.action = {
          useInModal: false,
          name: data.action,
        };
      });
  }
}
