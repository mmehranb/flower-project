import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map, mergeMap, catchError } from "rxjs/operators";
import { LoadingService } from "@shared/services/loading.service";
import { StaticDataService } from "@shared/services/static-data.service";
import { ProductsService } from '@shared/services/products.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: "root",
})
export class ProductsResolver implements Resolve<any> {
  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private staticDataService: StaticDataService,
    private router: Router,
    private productsService: ProductsService,
    private toastr: ToastrService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> {
    this.loading.show();
    return this.productsService.getProducts(route).pipe(
      map(r => {
        this.loading.complete();
        if (r == null) {
          this.toastr.error("صفحه مورد نظر شما یافت نشد", "خطا")
          this.router.navigateByUrl(`/`);
        }
        return r;
      })
    )
  }
}
