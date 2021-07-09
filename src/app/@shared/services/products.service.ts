import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from "@angular/router";
import { Observable, Subscribable, of, forkJoin } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map, mergeMap, catchError } from "rxjs/operators";
import { LoadingService } from "./loading.service";
import { environment } from "@env/environment";
import { AuthenticationService } from "@app/auth";
import { StaticDataService } from "./static-data.service";
@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private config: Object;
  constructor(private route: ActivatedRoute, private http: HttpClient, private staticDataService: StaticDataService) {}

  public getProducts(route: ActivatedRouteSnapshot, params?: object): Observable<any> {
    if (!route.params["eventName"]) {
      return this.staticDataService.getCategories().pipe(
        map((r: any) => {
          const category = this.getRouteCategoriesId(r, route);
          if (!category && route.params["category1"]) {
            return false;
          } else return category;
        }),
        catchError((error) => of(false)),
        mergeMap((r: any) => {
          if (r != false) {
            const queryParams = {
              per_page: 20,
              ...r,
              ...params,
              ...route.queryParams,
            };
            let queryParamsString = "";
            Object.entries(queryParams).forEach((param) => {
              queryParamsString += `${param[0]}=${param[1]}&`;
            });
            if (route.routeConfig.path == "search") {
              return this.http.get(`${environment.WEB_API_URL}/public/search?${queryParamsString}`).pipe(
                map((r: any) => {
                  return r.data;
                })
              );
            } else {
              return this.http.get(`${environment.WEB_API_URL}/public/getproducts?${queryParamsString}`).pipe(
                map((r: any) => {
                  let sortOption = "sort_order";
                  if (params && params["is_new"] == 1) sortOption = "sort_order_isnew";
                  if (params && params["special"] == 1) sortOption = "sort_order_special";
                  return {
                    ...r.data,
                    ...this.config,
                  };
                })
              );
            }
          } else {
            return null;
          }
        })
      );
    } else {
      return this.staticDataService.getEvents().pipe(
        map((r: any) => {
          const category = this.getRouteCategoriesId(r, route);
          if (!category && route.params["eventName"]) {
            return false;
          } else return category;
        }),
        catchError((error) => of(false)),
        mergeMap((r: any) => {
          if (r != false) {
            const queryParams = {
              per_page: 20,
              sortby: 101,
              ...params,
              ...route.queryParams,
              ...r,
            };
            let queryParamsString = "";
            Object.entries(queryParams).forEach((param) => {
              queryParamsString += `${param[0]}=${param[1]}&`;
            });
            return this.http.get(`${environment.WEB_API_URL}/public/getproducts?${queryParamsString}`).pipe(
              map((r: any) => {
                return { ...r.data, ...this.config };
              })
            );
          } else {
            return null;
          }
        })
      );
    }
  }
  public getProductInfo(id: number): Promise<any> {
    return this.http
      .get(`${environment.WEB_API_URL}/public/getproducts/${id}`)
      .pipe(map((r: any) => r.data[0] || null))
      .toPromise();
  }

  public calculateNewPrice(productId: number, option: string): Promise<any> {
    return this.http
      .get(
        `${environment.WEB_API_URL}/public/getproductcalculatedprice/${productId}?product_option_value_ids=${option}`
      )
      .toPromise();
  }

  private getRouteCategoriesId(categoryItems: any, route: ActivatedRouteSnapshot): object {
    let id: any = null;
    this.config = {};
    if (route.params["category1"]) {
      const categoryName = route.params["category2"] || route.params["category1"];
      id = null;
      categoryItems.forEach((item: any) => {
        if (item.cleanurl == categoryName || item.name == categoryName) {
          id = { categories_id: item.id };
          this.config = { ...item };
        } else if (item.children) {
          item.children.forEach((child: any) => {
            if (child.cleanurl == categoryName || child.name == categoryName) {
              id = { categories_id: child.id };
              this.config = { ...child };
            }
          });
        }
      });
    }
    if (route.params["tagId"]) {
      id = { tags_id: route.params["tagId"] };
    }
    if (route.params["eventName"]) {
      categoryItems.forEach((item: any) => {
        if (item.cleanurl == route.params["eventName"] || item.name == route.params["eventName"]) {
          id = { events_id: item.id };
          this.config = { ...item };
          return;
        }
      });
    }
    return id;
  }
  public addComment(product_id: number, content: any): Promise<any> {
    return this.http.post(`${environment.WEB_API_URL}/public/addreview/${product_id}`, content).toPromise();
  }

  getPostalCards(): Promise<any> {
    return this.http.get(`${environment.WEB_API_URL}/public/getpostalcards`).toPromise();
  }

  getLastSeenItemsInfo(): Observable<any> {
    const lastSeenItems: Array<any> = JSON.parse(localStorage.getItem("lastSeenItemsId") || "[]");
    let lastSeenItemsApi = lastSeenItems.map((r) => this.getProductInfo(r));
    return forkJoin(lastSeenItemsApi);
  }

  ctrlLastSeenItems(productId: number) {
    let lastSeenItems = JSON.parse(localStorage.getItem("lastSeenItemsId") || "[]");
    lastSeenItems = lastSeenItems.filter((item: any) => item != productId);
    localStorage.setItem("lastSeenItemsId", JSON.stringify([productId, ...lastSeenItems].slice(0, 6)));
  }
}
