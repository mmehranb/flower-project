import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { StaticDataService } from "@app/@shared/services/static-data.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  config: any;
  footerMenus: Array<any>;

  constructor(public router: Router, private staticDataService: StaticDataService) {
    this.staticDataService.getSiteConfig().subscribe((r: any) => {
      this.config = r.data[0];
    });
    this.staticDataService.getMenus().subscribe((r) => {
      this.footerMenus = r.filter((x: any) => x.place_id == 2);
      this.footerMenus.sort((x: any, y: any) => {
        if (x.sort_order < y.sort_order) {
          return -1;
        } else if (x.sort_order < y.sort_order) {
          return 1;
        }
        return 0;
      });
    });
  }

  ngOnInit(): void {}
}
