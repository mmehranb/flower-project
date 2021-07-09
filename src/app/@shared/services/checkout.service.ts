import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { LoadingService } from "./loading.service";
import { ToastrService } from "ngx-toastr";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root",
})
export class CheckoutService {
  order: any = {};
  private submitActionStatus = new Subject<any>();
  private factor = new Subject<any>();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private loading: LoadingService,
    private toastr: ToastrService,
  ) {}

  //ctrl submit action
  public callSubmitAction() {
    this.submitActionStatus.next(true);
  }
  public getSubmitAction(): Observable<boolean> {
    return this.submitActionStatus.asObservable();
  }
  //end

  //Factor
  public getFactor(): Observable<any> {
    return this.factor.asObservable()
  }
  public factorApiCall(): Promise<any> {
    const addressId = this.order.address_id;
    const couponName = this.order.coupon_name;
    let queryParam = couponName ? `address_id=${addressId}&coupon_name=${couponName}` : `address_id=${addressId}`
    return this.http.get(`${environment.WEB_API_URL}/public/basket/factor?${queryParam}`).pipe(map((r: any) => {
      this.factor.next(r.data);
      return r.data
    })).toPromise();
  }
  //end

  //time and hours
  getDeliveryTime(date: string): Promise<any> {
    return this.http.get(`${environment.WEB_API_URL}/public/gethoursofdeliverydate?persian_date=${date}`).toPromise();
  }
  getDeliveryDate(): Promise<any> {
    const addressId = this.order.address_id;
    return this.http.get(`${environment.WEB_API_URL}/public/getfirstdeliverydate?address_id=${addressId}`).toPromise();
  }
  //end

  //payment
  getIpgTypes(): Promise<any> {
    return this.http.get(`${environment.WEB_API_URL}/public/getpaymentmethods`).toPromise();
  }
  addPayment(data: any): Promise<any> {
    return this.http.post(`${environment.WEB_API_URL}/public/addpayment`, data).toPromise();
  }
  //end

  //ctrl order
  getUserOrders(): Promise<any> {
    return this.http.get(`${environment.WEB_API_URL}/public/order/get`).toPromise();
  }
  getOrderDetail(id: number): Promise<any> {
    return this.http.get(`${environment.WEB_API_URL}/public/order/get/${id}?brief=0`).toPromise();
  }
  addOrder(data: any): Promise<any> {
    return this.http.post(`${environment.WEB_API_URL}/public/order/add`, data).toPromise();
  }
  saveOrder(data: any) {
    this.order = data;
  }
  getOrder() {
    return this.order;
  }
  //end
}
