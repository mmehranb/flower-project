import { Injectable } from "@angular/core";
import { BehaviorSubject, forkJoin, Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { map, shareReplay } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class StaticDataService {
  private _categories: Observable<any>;
  private _events: Observable<any>;
  private _menus: Observable<any>;
  private ZoneBaseInfo$: Observable<any>;
  private SiteConfig$: Observable<any>;
  private categoriesItems$: Observable<any>;
  private categoriesItems: any = null;

  constructor(private http: HttpClient) {
    this.ZoneBaseInfo$ = this.http
      .get(`${environment.WEB_API_URL}/public/getbaseinfo?model_name[0]=Zone`)
      .pipe(shareReplay());
    this.SiteConfig$ = this.http.get(`${environment.WEB_API_URL}/public/getsiteconfig`).pipe(shareReplay());
    this.fetchCategories();
    this.fetchEvents();
    this.fetchMenus();
  }

  //Base Info
  public getZoneBaseInfo(): Observable<any> {
    return this.ZoneBaseInfo$;
  }
  //End
  //site config
  public getSiteConfig(): Observable<any> {
    return this.SiteConfig$;
  }
  //End

  // Categories
  public getCategories() {
    return this._categories;
  }
  private fetchCategories() {
    this._categories = this.http.get(environment.WEB_API_URL + "/public/getcategories").pipe(
      map((r: any) =>
        r.data.sort((x: any, y: any) => {
          if (x.sort_order < y.sort_order) {
            return -1;
          } else if (x.sort_order < y.sort_order) {
            return 1;
          }
          return 0;
        })
      ),
      shareReplay()
    );
  }
  // end
  // Categories
  public getEvents() {
    return this._events;
  }
  private fetchEvents() {
    this._events = this.http.get(environment.WEB_API_URL + "/public/getevents").pipe(
      map((r: any) =>
        r.data.sort((x: any, y: any) => {
          if (x.sort_order > y.sort_order) {
            return 1;
          } else if (x.sort_order < y.sort_order) {
            return -1;
          }
          return 0;
        })
      ),
      shareReplay()
    );
  }
  // end
  // Dynamice header and footer
  public getMenus() {
    return this._menus;
  }
  public fetchMenus() {
    this._menus = this.http.get(environment.WEB_API_URL + "/public/getmenus").pipe(
      map((r: any) => r.data),
      shareReplay()
    );
  }
  // end
  // Options
  public getProductsOptions(): Promise<any> {
    return this.http.get(`${environment.WEB_API_URL}/public/getoptions`).toPromise();
  }
  //end

  //banner
  public getBanners(): Observable<any> {
    return this.http.get(`${environment.WEB_API_URL}/public/getbanners`).pipe(map((r: any) => r.data));
  }
  //end

  parseArabicOrPersian(str: any) {
    if (str && str.length) {
      return String(
        str
          .replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d: any) {
            return d.charCodeAt(0) - 1632; // Convert Arabic numbers
          })
          .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function (d: any) {
            return d.charCodeAt(0) - 1776; // Convert Persian numbers
          })
      );
    }
    return null;
  }

  changObjNumberToEnglish(obj: object) {
    let value: object = {};
    Object.entries(obj).forEach((item) => {
      if (typeof item[1] == "string" || item[1] instanceof String) {
        value[item[0]] = this.parseArabicOrPersian(item[1]);
      } else {
        value[item[0]] = item[1];
      }
    });
    return value;
  }
}
