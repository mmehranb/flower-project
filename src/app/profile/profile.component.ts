import { Component, OnInit } from "@angular/core";
import { Tab } from "@shared/viewModels/tab.model";
import { Router } from "@angular/router";
import { AuthenticationService } from "@app/auth";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  activeTab: number;
  tabItems: Array<Tab> = [
    {
      title: "اطلاعات شخصی",
      id: 1,
      url: "/profile/user",
    },
    {
      title: "آدرس‌ها",
      id: 2,
      url: "/profile/addresses",
    },
    {
      title: "سفارشات",
      id: 3,
      url: "/profile/orders",
    },
    {
      title: "علاقه‌مندی‌ها",
      id: 5,
      url: "/profile/interests",
    },
    {
      title: "تقویم شخصی",
      id: 6,
      url: "/profile/reminders",
    },
  ];

  constructor(public router: Router, private authenticationService: AuthenticationService) {}

  ngOnInit(): void {}

  tabRouteHandler(tab: Tab) {
    this.router.navigateByUrl(tab.url);
  }

  exit() {
    this.authenticationService.exit();
  }
}
