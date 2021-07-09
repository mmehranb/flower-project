import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map, mergeMap, catchError } from "rxjs/operators";
import { environment } from "@env/environment";
import { LoadingService } from "@shared/services/loading.service";
import { StaticDataService } from "@shared/services/static-data.service";
import { ProductsService } from "@shared/services/products.service";

@Injectable({
  providedIn: "root",
})
export class ProductResolver implements Resolve<any> {
  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private staticDataService: StaticDataService,
    private router: Router,
    private productsService: ProductsService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    this.loading.show();
    return this.productsService.getProductInfo(route.params.id).then((r) => {
      this.loading.complete();
      return r;
    });
  }
}
