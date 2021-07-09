import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute, NavigationStart } from "@angular/router";
import { Meta, Title } from "@angular/platform-browser";
import { SwUpdate } from "@angular/service-worker";
import { Logger } from "@core";

const log = new Logger("App");

declare var gtag: Function;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  showUpdateBtn: boolean = false;
  constructor(private swUpdate: SwUpdate, private router: Router, private title: Title, private meta: Meta) {
    // Global site tag (gtag.js) - Google Analytics
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.title.setTitle("گل فروشی آنلاین | خرید گل و سفارش آنلاین گل | بنیس فلاور");
        this.meta.updateTag({
          name: "description",
          content:
            "خرید گل و گیاه از گل فروشی آنلاین بنیس فلاور مجهز به گلخانه اختصاصی خرید آنلاین گل و گلدان و انواع گل خاص و کمیاب با ارسال رایگان از گل فروشی آنلاین. 02144002320",
        });
        this.meta.updateTag({
          name: "twitter:description",
          content:
            "خرید گل و گیاه از گل فروشی آنلاین بنیس فلاور مجهز به گلخانه اختصاصی خرید آنلاین گل و گلدان و انواع گل خاص و کمیاب با ارسال رایگان از گل فروشی آنلاین. 02144002320",
        });
        this.meta.updateTag({
          property: "og:description",
          content:
            "خرید گل و گیاه از گل فروشی آنلاین بنیس فلاور مجهز به گلخانه اختصاصی خرید آنلاین گل و گلدان و انواع گل خاص و کمیاب با ارسال رایگان از گل فروشی آنلاین. 02144002320",
        });
      }
      if (event instanceof NavigationEnd) {
        gtag("config", "UA-144006144-1", {
          page_path: event.urlAfterRedirects,
        });
      }
    });
  }

  ngOnInit() {
    this.swUpdate.available.subscribe((event: any) => {
      this.showUpdateBtn = true;
    });
  }

  onUpdate() {
    window.location.reload();
  }
}
