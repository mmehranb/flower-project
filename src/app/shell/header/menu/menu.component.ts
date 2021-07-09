import { Component, OnInit, Input } from "@angular/core";
import { StaticDataService } from "@app/@shared/services/static-data.service";
import { environment } from "@env/environment";

@Component({
  selector: "header-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit {
  @Input() useInModal: boolean = true;
  categories: Array<any>;
  events: Array<any>;
  categorySubmenuActive: boolean = false;
  eventSubmenuActive: boolean = false;
  currentCategory: number = 16;
  currentEvent: number = 34;
  menus: Array<any>;

  constructor(private staticDataService: StaticDataService) {
    this.staticDataService.getMenus().subscribe((menus) => {
      this.menus = menus.filter((item: any) => item.place_id != 2);
      this.menus.sort((x, y) => {
        if (x.sort_order < y.sort_order) return -1;
        if (x.sort_order > y.sort_order) return 1;
        return 0;
      });
    });
    this.staticDataService.getCategories().subscribe((items) => {
      this.categories = items.filter((item: any) => {
        if (item.showinmenu == 1) {
          if (item.children) {
            item.children = item.children.filter((child: any) => child.showinmenu == 1);
          }
          return true;
        }
        return false;
      });
    });
    this.staticDataService.getEvents().subscribe((items) => {
      this.events = items;
    });
  }

  ngOnInit(): void {}

  getImageUrl(x: string) {
    return environment.CDN + `/${x}`;
  }
}
